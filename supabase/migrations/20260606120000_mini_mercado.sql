-- =============================================
-- MINI MERCADO - Gestao de vendas fiado em retiros
-- Modulo do app Discernir. Multi-tenant por evento (RLS).
-- Dinheiro sempre em centavos (INTEGER). Prefixo mm_.
-- =============================================

-- 1. EVENTOS (retiros)
CREATE TABLE IF NOT EXISTS public.mm_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id),
  movement TEXT,                                  -- 'ecc','segue-me','vem',...
  name TEXT NOT NULL,
  starts_on DATE,
  ends_on DATE,
  pix_key TEXT,
  pix_key_type TEXT CHECK (pix_key_type IN ('cpf','cnpj','email','phone','random')),
  pix_merchant_name TEXT,
  pix_merchant_city TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closing','closed','archived')),
  join_code TEXT UNIQUE NOT NULL DEFAULT upper(substr(gen_random_uuid()::text, 1, 6)),
  currency TEXT NOT NULL DEFAULT 'BRL',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mm_events_owner ON public.mm_events(owner_id);
CREATE INDEX IF NOT EXISTS idx_mm_events_join_code ON public.mm_events(join_code);

-- 2. OPERADORES (vinculo user <-> evento)
CREATE TABLE IF NOT EXISTS public.mm_operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.mm_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  role TEXT NOT NULL DEFAULT 'caixa' CHECK (role IN ('gestor','caixa')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_mm_operators_user ON public.mm_operators(user_id);
CREATE INDEX IF NOT EXISTS idx_mm_operators_event ON public.mm_operators(event_id);

-- 3. EQUIPES de trabalho do retiro
CREATE TABLE IF NOT EXISTS public.mm_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.mm_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, name)
);
CREATE INDEX IF NOT EXISTS idx_mm_teams_event ON public.mm_teams(event_id);

-- 4. SERVOS (compradores). Casal = duas linhas com spouse_servo_id cruzado.
CREATE TABLE IF NOT EXISTS public.mm_servos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.mm_events(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.mm_teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  nickname TEXT,
  phone TEXT,
  kind TEXT NOT NULL DEFAULT 'individual' CHECK (kind IN ('casal','jovem','individual','padre')),
  spouse_servo_id UUID REFERENCES public.mm_servos(id) ON DELETE SET NULL,
  birth_date TEXT,                                -- dd/mm (do PDF do Quadrante)
  wedding_date TEXT,                              -- dd/mm
  is_quick_add BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mm_servos_event ON public.mm_servos(event_id);
CREATE INDEX IF NOT EXISTS idx_mm_servos_team ON public.mm_servos(team_id);

-- 5. PRODUTOS (catalogo por evento)
CREATE TABLE IF NOT EXISTS public.mm_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.mm_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, name)
);
CREATE INDEX IF NOT EXISTS idx_mm_products_event ON public.mm_products(event_id);

-- 6. COMPRAS (cabecalho)
CREATE TABLE IF NOT EXISTS public.mm_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.mm_events(id) ON DELETE CASCADE,
  servo_id UUID NOT NULL REFERENCES public.mm_servos(id) ON DELETE RESTRICT,
  operator_id UUID REFERENCES public.mm_operators(id),
  total_cents INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mm_purchases_event ON public.mm_purchases(event_id);
CREATE INDEX IF NOT EXISTS idx_mm_purchases_servo ON public.mm_purchases(servo_id);

-- 7. ITENS DA COMPRA (snapshot de nome+preco; product_id nullable p/ item avulso)
CREATE TABLE IF NOT EXISTS public.mm_purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.mm_purchases(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.mm_events(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.mm_products(id) ON DELETE SET NULL,
  name_snapshot TEXT NOT NULL,
  price_cents_snapshot INTEGER NOT NULL CHECK (price_cents_snapshot >= 0),
  qty INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  line_total_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mm_purchase_items_purchase ON public.mm_purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_mm_purchase_items_event ON public.mm_purchase_items(event_id);

-- 8. FECHAMENTO / PAGAMENTO por servo
CREATE TABLE IF NOT EXISTS public.mm_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.mm_events(id) ON DELETE CASCADE,
  servo_id UUID NOT NULL REFERENCES public.mm_servos(id) ON DELETE RESTRICT,
  total_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','waived')),
  paid_at TIMESTAMPTZ,
  paid_method TEXT CHECK (paid_method IN ('pix','cash','other')),
  settled_by UUID REFERENCES public.mm_operators(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, servo_id)
);

-- =============================================
-- HELPERS (SECURITY DEFINER: nao recursam no RLS)
-- =============================================
CREATE OR REPLACE FUNCTION public.mm_is_operator(check_event_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.mm_operators o
    WHERE o.event_id = check_event_id
      AND o.user_id = auth.uid()
      AND o.is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.mm_is_gestor(check_event_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.mm_operators o
    WHERE o.event_id = check_event_id
      AND o.user_id = auth.uid()
      AND o.is_active = true
      AND o.role = 'gestor'
  );
$$;

-- Entrar num evento pelo codigo (cria vinculo caixa)
CREATE OR REPLACE FUNCTION public.mm_join_event(p_join_code TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_event_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Voce precisa estar logado';
  END IF;
  SELECT id INTO v_event_id
  FROM public.mm_events
  WHERE upper(join_code) = upper(trim(p_join_code))
  LIMIT 1;
  IF v_event_id IS NULL THEN
    RAISE EXCEPTION 'Codigo de retiro invalido';
  END IF;
  INSERT INTO public.mm_operators (event_id, user_id, role)
  VALUES (v_event_id, auth.uid(), 'caixa')
  ON CONFLICT (event_id, user_id) DO UPDATE SET is_active = true;
  RETURN v_event_id;
END;
$$;

-- Ao criar evento, vincula o dono como gestor
CREATE OR REPLACE FUNCTION public.mm_event_add_owner_operator()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.mm_operators (event_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'gestor')
  ON CONFLICT (event_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Recalcula total do cabecalho a partir dos itens
CREATE OR REPLACE FUNCTION public.mm_recompute_purchase_total()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  pid UUID;
BEGIN
  pid := COALESCE(NEW.purchase_id, OLD.purchase_id);
  UPDATE public.mm_purchases p
  SET total_cents = COALESCE(
        (SELECT SUM(line_total_cents) FROM public.mm_purchase_items WHERE purchase_id = pid), 0),
      updated_at = now()
  WHERE p.id = pid;
  RETURN NULL;
END;
$$;

-- =============================================
-- TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS mm_events_add_owner ON public.mm_events;
CREATE TRIGGER mm_events_add_owner
  AFTER INSERT ON public.mm_events
  FOR EACH ROW EXECUTE FUNCTION public.mm_event_add_owner_operator();

DROP TRIGGER IF EXISTS mm_items_recompute_total ON public.mm_purchase_items;
CREATE TRIGGER mm_items_recompute_total
  AFTER INSERT OR UPDATE OR DELETE ON public.mm_purchase_items
  FOR EACH ROW EXECUTE FUNCTION public.mm_recompute_purchase_total();

CREATE TRIGGER update_mm_events_updated_at BEFORE UPDATE ON public.mm_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mm_operators_updated_at BEFORE UPDATE ON public.mm_operators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mm_teams_updated_at BEFORE UPDATE ON public.mm_teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mm_servos_updated_at BEFORE UPDATE ON public.mm_servos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mm_products_updated_at BEFORE UPDATE ON public.mm_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mm_purchases_updated_at BEFORE UPDATE ON public.mm_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mm_settlements_updated_at BEFORE UPDATE ON public.mm_settlements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- VIEW: saldo por servo (ao vivo). security_invoker herda RLS das base tables.
-- =============================================
CREATE OR REPLACE VIEW public.mm_servo_balances
WITH (security_invoker = on) AS
SELECT
  s.event_id,
  s.id AS servo_id,
  s.name,
  s.nickname,
  s.team_id,
  s.spouse_servo_id,
  COALESCE(SUM(p.total_cents), 0)::INTEGER AS total_cents,
  COUNT(p.id) AS purchase_count
FROM public.mm_servos s
LEFT JOIN public.mm_purchases p ON p.servo_id = s.id
GROUP BY s.id;

-- =============================================
-- RLS
-- =============================================
ALTER TABLE public.mm_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_servos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_settlements ENABLE ROW LEVEL SECURITY;

-- mm_events
CREATE POLICY "mm_events select" ON public.mm_events FOR SELECT
  USING (owner_id = auth.uid() OR public.mm_is_operator(id));
CREATE POLICY "mm_events insert" ON public.mm_events FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "mm_events update" ON public.mm_events FOR UPDATE
  USING (owner_id = auth.uid() OR public.mm_is_gestor(id));
CREATE POLICY "mm_events delete" ON public.mm_events FOR DELETE
  USING (owner_id = auth.uid());

-- mm_operators
CREATE POLICY "mm_operators select" ON public.mm_operators FOR SELECT
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_operators insert self" ON public.mm_operators FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "mm_operators update gestor" ON public.mm_operators FOR UPDATE
  USING (public.mm_is_gestor(event_id));
CREATE POLICY "mm_operators delete gestor" ON public.mm_operators FOR DELETE
  USING (public.mm_is_gestor(event_id));

-- mm_teams
CREATE POLICY "mm_teams select" ON public.mm_teams FOR SELECT
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_teams insert" ON public.mm_teams FOR INSERT
  WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_teams update" ON public.mm_teams FOR UPDATE
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_teams delete" ON public.mm_teams FOR DELETE
  USING (public.mm_is_gestor(event_id));

-- mm_servos
CREATE POLICY "mm_servos select" ON public.mm_servos FOR SELECT
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_servos insert" ON public.mm_servos FOR INSERT
  WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_servos update" ON public.mm_servos FOR UPDATE
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_servos delete" ON public.mm_servos FOR DELETE
  USING (public.mm_is_gestor(event_id));

-- mm_products
CREATE POLICY "mm_products select" ON public.mm_products FOR SELECT
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_products insert" ON public.mm_products FOR INSERT
  WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_products update" ON public.mm_products FOR UPDATE
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_products delete" ON public.mm_products FOR DELETE
  USING (public.mm_is_gestor(event_id));

-- mm_purchases
CREATE POLICY "mm_purchases select" ON public.mm_purchases FOR SELECT
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_purchases insert" ON public.mm_purchases FOR INSERT
  WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_purchases update" ON public.mm_purchases FOR UPDATE
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_purchases delete" ON public.mm_purchases FOR DELETE
  USING (public.mm_is_operator(event_id));

-- mm_purchase_items
CREATE POLICY "mm_items select" ON public.mm_purchase_items FOR SELECT
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_items insert" ON public.mm_purchase_items FOR INSERT
  WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_items update" ON public.mm_purchase_items FOR UPDATE
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_items delete" ON public.mm_purchase_items FOR DELETE
  USING (public.mm_is_operator(event_id));

-- mm_settlements
CREATE POLICY "mm_settlements select" ON public.mm_settlements FOR SELECT
  USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_settlements insert" ON public.mm_settlements FOR INSERT
  WITH CHECK (public.mm_is_gestor(event_id));
CREATE POLICY "mm_settlements update" ON public.mm_settlements FOR UPDATE
  USING (public.mm_is_gestor(event_id));
