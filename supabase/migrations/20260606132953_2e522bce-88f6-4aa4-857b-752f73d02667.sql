-- GRANTs (Data API)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mm_events, public.mm_operators, public.mm_teams, public.mm_servos, public.mm_products, public.mm_purchases, public.mm_purchase_items, public.mm_settlements TO authenticated;
GRANT ALL ON public.mm_events, public.mm_operators, public.mm_teams, public.mm_servos, public.mm_products, public.mm_purchases, public.mm_purchase_items, public.mm_settlements TO service_role;

-- HELPERS
CREATE OR REPLACE FUNCTION public.mm_is_operator(check_event_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.mm_operators o WHERE o.event_id = check_event_id AND o.user_id = auth.uid() AND o.is_active = true);
$$;

CREATE OR REPLACE FUNCTION public.mm_is_gestor(check_event_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.mm_operators o WHERE o.event_id = check_event_id AND o.user_id = auth.uid() AND o.is_active = true AND o.role = 'gestor');
$$;

CREATE OR REPLACE FUNCTION public.mm_join_event(p_join_code TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_event_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Voce precisa estar logado'; END IF;
  SELECT id INTO v_event_id FROM public.mm_events WHERE upper(join_code) = upper(trim(p_join_code)) LIMIT 1;
  IF v_event_id IS NULL THEN RAISE EXCEPTION 'Codigo de retiro invalido'; END IF;
  INSERT INTO public.mm_operators (event_id, user_id, role) VALUES (v_event_id, auth.uid(), 'caixa')
  ON CONFLICT (event_id, user_id) DO UPDATE SET is_active = true;
  RETURN v_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.mm_event_add_owner_operator()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.mm_operators (event_id, user_id, role) VALUES (NEW.id, NEW.owner_id, 'gestor')
  ON CONFLICT (event_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.mm_recompute_purchase_total()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE pid UUID;
BEGIN
  pid := COALESCE(NEW.purchase_id, OLD.purchase_id);
  UPDATE public.mm_purchases p SET total_cents = COALESCE((SELECT SUM(line_total_cents) FROM public.mm_purchase_items WHERE purchase_id = pid), 0), updated_at = now() WHERE p.id = pid;
  RETURN NULL;
END;
$$;

-- TRIGGERS (drop if exists then create)
DROP TRIGGER IF EXISTS mm_events_add_owner ON public.mm_events;
CREATE TRIGGER mm_events_add_owner AFTER INSERT ON public.mm_events FOR EACH ROW EXECUTE FUNCTION public.mm_event_add_owner_operator();

DROP TRIGGER IF EXISTS mm_items_recompute_total ON public.mm_purchase_items;
CREATE TRIGGER mm_items_recompute_total AFTER INSERT OR UPDATE OR DELETE ON public.mm_purchase_items FOR EACH ROW EXECUTE FUNCTION public.mm_recompute_purchase_total();

DROP TRIGGER IF EXISTS update_mm_events_updated_at ON public.mm_events;
CREATE TRIGGER update_mm_events_updated_at BEFORE UPDATE ON public.mm_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_mm_operators_updated_at ON public.mm_operators;
CREATE TRIGGER update_mm_operators_updated_at BEFORE UPDATE ON public.mm_operators FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_mm_teams_updated_at ON public.mm_teams;
CREATE TRIGGER update_mm_teams_updated_at BEFORE UPDATE ON public.mm_teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_mm_servos_updated_at ON public.mm_servos;
CREATE TRIGGER update_mm_servos_updated_at BEFORE UPDATE ON public.mm_servos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_mm_products_updated_at ON public.mm_products;
CREATE TRIGGER update_mm_products_updated_at BEFORE UPDATE ON public.mm_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_mm_purchases_updated_at ON public.mm_purchases;
CREATE TRIGGER update_mm_purchases_updated_at BEFORE UPDATE ON public.mm_purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_mm_settlements_updated_at ON public.mm_settlements;
CREATE TRIGGER update_mm_settlements_updated_at BEFORE UPDATE ON public.mm_settlements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- VIEW
CREATE OR REPLACE VIEW public.mm_servo_balances WITH (security_invoker = on) AS
SELECT s.event_id, s.id AS servo_id, s.name, s.nickname, s.team_id, s.spouse_servo_id,
  COALESCE(SUM(p.total_cents), 0)::INTEGER AS total_cents, COUNT(p.id) AS purchase_count
FROM public.mm_servos s LEFT JOIN public.mm_purchases p ON p.servo_id = s.id
GROUP BY s.id;
GRANT SELECT ON public.mm_servo_balances TO authenticated, service_role;

-- RLS
ALTER TABLE public.mm_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_servos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_settlements ENABLE ROW LEVEL SECURITY;

-- POLICIES (drop + create)
DROP POLICY IF EXISTS "mm_events select" ON public.mm_events;
DROP POLICY IF EXISTS "mm_events insert" ON public.mm_events;
DROP POLICY IF EXISTS "mm_events update" ON public.mm_events;
DROP POLICY IF EXISTS "mm_events delete" ON public.mm_events;
CREATE POLICY "mm_events select" ON public.mm_events FOR SELECT USING (owner_id = auth.uid() OR public.mm_is_operator(id));
CREATE POLICY "mm_events insert" ON public.mm_events FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "mm_events update" ON public.mm_events FOR UPDATE USING (owner_id = auth.uid() OR public.mm_is_gestor(id));
CREATE POLICY "mm_events delete" ON public.mm_events FOR DELETE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "mm_operators select" ON public.mm_operators;
DROP POLICY IF EXISTS "mm_operators insert self" ON public.mm_operators;
DROP POLICY IF EXISTS "mm_operators update gestor" ON public.mm_operators;
DROP POLICY IF EXISTS "mm_operators delete gestor" ON public.mm_operators;
CREATE POLICY "mm_operators select" ON public.mm_operators FOR SELECT USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_operators insert self" ON public.mm_operators FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "mm_operators update gestor" ON public.mm_operators FOR UPDATE USING (public.mm_is_gestor(event_id));
CREATE POLICY "mm_operators delete gestor" ON public.mm_operators FOR DELETE USING (public.mm_is_gestor(event_id));

DROP POLICY IF EXISTS "mm_teams select" ON public.mm_teams;
DROP POLICY IF EXISTS "mm_teams insert" ON public.mm_teams;
DROP POLICY IF EXISTS "mm_teams update" ON public.mm_teams;
DROP POLICY IF EXISTS "mm_teams delete" ON public.mm_teams;
CREATE POLICY "mm_teams select" ON public.mm_teams FOR SELECT USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_teams insert" ON public.mm_teams FOR INSERT WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_teams update" ON public.mm_teams FOR UPDATE USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_teams delete" ON public.mm_teams FOR DELETE USING (public.mm_is_gestor(event_id));

DROP POLICY IF EXISTS "mm_servos select" ON public.mm_servos;
DROP POLICY IF EXISTS "mm_servos insert" ON public.mm_servos;
DROP POLICY IF EXISTS "mm_servos update" ON public.mm_servos;
DROP POLICY IF EXISTS "mm_servos delete" ON public.mm_servos;
CREATE POLICY "mm_servos select" ON public.mm_servos FOR SELECT USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_servos insert" ON public.mm_servos FOR INSERT WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_servos update" ON public.mm_servos FOR UPDATE USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_servos delete" ON public.mm_servos FOR DELETE USING (public.mm_is_gestor(event_id));

DROP POLICY IF EXISTS "mm_products select" ON public.mm_products;
DROP POLICY IF EXISTS "mm_products insert" ON public.mm_products;
DROP POLICY IF EXISTS "mm_products update" ON public.mm_products;
DROP POLICY IF EXISTS "mm_products delete" ON public.mm_products;
CREATE POLICY "mm_products select" ON public.mm_products FOR SELECT USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_products insert" ON public.mm_products FOR INSERT WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_products update" ON public.mm_products FOR UPDATE USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_products delete" ON public.mm_products FOR DELETE USING (public.mm_is_gestor(event_id));

DROP POLICY IF EXISTS "mm_purchases select" ON public.mm_purchases;
DROP POLICY IF EXISTS "mm_purchases insert" ON public.mm_purchases;
DROP POLICY IF EXISTS "mm_purchases update" ON public.mm_purchases;
DROP POLICY IF EXISTS "mm_purchases delete" ON public.mm_purchases;
CREATE POLICY "mm_purchases select" ON public.mm_purchases FOR SELECT USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_purchases insert" ON public.mm_purchases FOR INSERT WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_purchases update" ON public.mm_purchases FOR UPDATE USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_purchases delete" ON public.mm_purchases FOR DELETE USING (public.mm_is_operator(event_id));

DROP POLICY IF EXISTS "mm_items select" ON public.mm_purchase_items;
DROP POLICY IF EXISTS "mm_items insert" ON public.mm_purchase_items;
DROP POLICY IF EXISTS "mm_items update" ON public.mm_purchase_items;
DROP POLICY IF EXISTS "mm_items delete" ON public.mm_purchase_items;
CREATE POLICY "mm_items select" ON public.mm_purchase_items FOR SELECT USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_items insert" ON public.mm_purchase_items FOR INSERT WITH CHECK (public.mm_is_operator(event_id));
CREATE POLICY "mm_items update" ON public.mm_purchase_items FOR UPDATE USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_items delete" ON public.mm_purchase_items FOR DELETE USING (public.mm_is_operator(event_id));

DROP POLICY IF EXISTS "mm_settlements select" ON public.mm_settlements;
DROP POLICY IF EXISTS "mm_settlements insert" ON public.mm_settlements;
DROP POLICY IF EXISTS "mm_settlements update" ON public.mm_settlements;
CREATE POLICY "mm_settlements select" ON public.mm_settlements FOR SELECT USING (public.mm_is_operator(event_id));
CREATE POLICY "mm_settlements insert" ON public.mm_settlements FOR INSERT WITH CHECK (public.mm_is_gestor(event_id));
CREATE POLICY "mm_settlements update" ON public.mm_settlements FOR UPDATE USING (public.mm_is_gestor(event_id));