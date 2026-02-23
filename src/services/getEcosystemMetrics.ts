/**
 * getEcosystemMetrics - Aggregates data from all Nello modules.
 */

import { supabase } from '@/integrations/supabase/client';

export interface CouponUsageItem {
  code: string;
  discountType: string;
  discountValue: number;
  timesUsed: number;
  maxUses: number | null;
  isActive: boolean;
  allowedProduct: string | null;
}

export interface EcosystemMetrics {
  users: { total: number; newLast7Days: number; codigosEssenciaAtivados: number; activeUsers: number };
  operators: { active: number; avgClientsPerOperator: number; companiesLinked: number; activeProgramas: number };
  companies: { total: number; colaboradoresMapeados: number; activeSubscriptions: number; renewalsNext30Days: number };
  financial: {
    mrrIndividual: number;
    mrrCorporate: number;
    totalRevenue: number;
    churnRate: number;
    realRevenue: number;
    zeroPricePurchases: number;
    paidPurchases: number;
    totalPurchases: number;
    coupon100Count: number;
  };
  coupons: CouponUsageItem[];
  system: { featureFlagsEnabled: number; featureFlagsTotal: number; recentErrors: number; activeModules: string[] };
}

async function queryCount(fn: () => Promise<{ count: number | null }>): Promise<number> {
  const res = await fn();
  return res.count || 0;
}

export async function getEcosystemMetrics(): Promise<EcosystemMetrics> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // All counts via individual awaits to avoid TS2589
  const totalProfiles = await queryCount(() => supabase.from('profiles').select('*', { count: 'exact', head: true }) as any);
  const newUsers7d = await queryCount(async () => {
    const q = supabase.from('profiles').select('*', { count: 'exact', head: true }) as any;
    return q.gte('created_at', sevenDaysAgo);
  });
  const codigosAtivados = await queryCount(() => supabase.from('ativacao_codigo').select('*', { count: 'exact', head: true }) as any);
  const activeTests = await queryCount(async () => {
    const q = supabase.from('user_tests').select('*', { count: 'exact', head: true }) as any;
    return q.eq('status', 'completed');
  });

  const activeOperators = await queryCount(async () => {
    const q = supabase.from('operator_workspaces').select('*', { count: 'exact', head: true }) as any;
    return q.eq('is_active', true);
  });
  const activeClients = await queryCount(async () => {
    const q = supabase.from('client_operator_relationships').select('*', { count: 'exact', head: true }) as any;
    return q.eq('status', 'active');
  });
  const operatorCompanies = await queryCount(async () => {
    const q = supabase.from('company_operators').select('*', { count: 'exact', head: true }) as any;
    return q.eq('status', 'active');
  });
  const activePrograms = await queryCount(async () => {
    const q = supabase.from('company_programs').select('*', { count: 'exact', head: true }) as any;
    return q.eq('status', 'active');
  });

  const totalCompanies = await queryCount(() => supabase.from('companies').select('*', { count: 'exact', head: true }) as any);
  const activeCompanyUsers = await queryCount(async () => {
    const q = supabase.from('company_users').select('*', { count: 'exact', head: true }) as any;
    return q.eq('is_active', true);
  });
  const activeSubs = await queryCount(async () => {
    const q = supabase.from('company_subscriptions').select('*', { count: 'exact', head: true }) as any;
    return q.eq('status', 'active');
  });
  const cancelledSubs = await queryCount(async () => {
    const q = supabase.from('company_subscriptions').select('*', { count: 'exact', head: true }) as any;
    return q.eq('status', 'canceled');
  });

  // Financial
  const monthlyRevRes = await (supabase.from('test_purchases').select('price_paid') as any).eq('payment_status', 'completed').gte('purchased_at', monthStart);
  const totalRevRes = await (supabase.from('test_purchases').select('price_paid, payment_method') as any).eq('payment_status', 'completed');
  const corpSubsRes = await (supabase.from('company_subscriptions').select('price_per_collaborator, current_collaborators') as any).eq('status', 'active');
  const flagsRes = await (supabase.from('app_settings').select('key, value') as any).like('key', 'feature_%');

  // Coupons data
  const couponsRes = await (supabase.from('coupons').select('code, discount_type, discount_value, times_used, max_uses, is_active, allowed_product_type') as any).order('times_used', { ascending: false });

  const allPurchases: any[] = totalRevRes.data || [];
  const individualMRR = (monthlyRevRes.data || []).reduce((s: number, p: any) => s + (p.price_paid || 0), 0);
  const corporateMRR = (corpSubsRes.data || []).reduce((s: number, sub: any) => s + ((sub.price_per_collaborator || 0) * (sub.current_collaborators || 0)), 0);
  const totalRevenue = allPurchases.reduce((s: number, p: any) => s + (p.price_paid || 0), 0);
  const realRevenue = allPurchases.filter((p: any) => p.price_paid > 0).reduce((s: number, p: any) => s + (p.price_paid || 0), 0);
  const zeroPricePurchases = allPurchases.filter((p: any) => p.price_paid === 0 || p.price_paid === '0.00' || Number(p.price_paid) === 0).length;
  const paidPurchases = allPurchases.filter((p: any) => Number(p.price_paid) > 0).length;
  const coupon100Count = allPurchases.filter((p: any) => p.payment_method === 'coupon_100').length;

  const flagsData: any[] = flagsRes.data || [];
  const enabledFlags = flagsData.filter((f: any) => f.value?.enabled === true).length;

  const activeModules: string[] = ['Identity'];
  if (activeOperators > 0) activeModules.push('Praxis');
  if (totalCompanies > 0) activeModules.push('Business');
  if (totalCompanies > 0) activeModules.push('Hiring');
  activeModules.push('Discernir');

  const totalSubs = activeSubs + cancelledSubs;

  const couponsData: CouponUsageItem[] = (couponsRes.data || []).map((c: any) => ({
    code: c.code,
    discountType: c.discount_type,
    discountValue: c.discount_value,
    timesUsed: c.times_used || 0,
    maxUses: c.max_uses,
    isActive: c.is_active,
    allowedProduct: c.allowed_product_type,
  }));

  return {
    users: { total: totalProfiles, newLast7Days: newUsers7d, codigosEssenciaAtivados: codigosAtivados, activeUsers: activeTests },
    operators: { active: activeOperators, avgClientsPerOperator: activeOperators > 0 ? Math.round(activeClients / activeOperators) : 0, companiesLinked: operatorCompanies, activeProgramas: activePrograms },
    companies: { total: totalCompanies, colaboradoresMapeados: activeCompanyUsers, activeSubscriptions: activeSubs, renewalsNext30Days: 0 },
    financial: {
      mrrIndividual: individualMRR,
      mrrCorporate: corporateMRR,
      totalRevenue,
      churnRate: totalSubs > 0 ? Math.round((cancelledSubs / totalSubs) * 100) : 0,
      realRevenue,
      zeroPricePurchases,
      paidPurchases,
      totalPurchases: allPurchases.length,
      coupon100Count,
    },
    coupons: couponsData,
    system: { featureFlagsEnabled: enabledFlags, featureFlagsTotal: flagsData.length, recentErrors: 0, activeModules },
  };
}
