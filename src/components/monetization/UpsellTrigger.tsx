import { useEffect, useState, useCallback } from "react";
import { ProductPaywallModal, ProductInfo } from "./ProductPaywallModal";
import { useProductAccess } from "@/hooks/useProductAccess";
import { PRODUCT_CATALOG } from "./productCatalog";

interface UpsellTriggerProps {
  triggerProduct: string; // Product being viewed (e.g., "codigo_essencia")
  upsellProduct: string; // Product to offer (e.g., "activation_individual")
  delayMs?: number; // Delay before showing (default 3000ms)
  showOnce?: boolean; // Only show once per session
}

const SHOWN_UPSELLS_KEY = "nello_shown_upsells";

export function UpsellTrigger({
  triggerProduct,
  upsellProduct,
  delayMs = 3000,
  showOnce = true,
}: UpsellTriggerProps) {
  const [showModal, setShowModal] = useState(false);
  const { hasAccess } = useProductAccess(upsellProduct as any);

  const product = PRODUCT_CATALOG[upsellProduct];

  const hasBeenShown = useCallback(() => {
    if (!showOnce) return false;
    try {
      const shown = sessionStorage.getItem(SHOWN_UPSELLS_KEY);
      if (!shown) return false;
      const shownList = JSON.parse(shown) as string[];
      return shownList.includes(`${triggerProduct}_${upsellProduct}`);
    } catch {
      return false;
    }
  }, [triggerProduct, upsellProduct, showOnce]);

  const markAsShown = useCallback(() => {
    if (!showOnce) return;
    try {
      const shown = sessionStorage.getItem(SHOWN_UPSELLS_KEY);
      const shownList = shown ? JSON.parse(shown) : [];
      shownList.push(`${triggerProduct}_${upsellProduct}`);
      sessionStorage.setItem(SHOWN_UPSELLS_KEY, JSON.stringify(shownList));
    } catch {
      // Ignore storage errors
    }
  }, [triggerProduct, upsellProduct, showOnce]);

  useEffect(() => {
    // Don't show if user already has access or if already shown
    if (hasAccess || hasBeenShown() || !product) return;

    const timer = setTimeout(() => {
      setShowModal(true);
      markAsShown();
    }, delayMs);

    return () => clearTimeout(timer);
  }, [hasAccess, hasBeenShown, markAsShown, delayMs, product]);

  if (!product) return null;

  return (
    <ProductPaywallModal
      open={showModal}
      onOpenChange={setShowModal}
      product={product}
    />
  );
}

// Pre-configured upsell for Código da Essência -> Ativação
export function CodigoEssenciaUpsell() {
  return (
    <UpsellTrigger
      triggerProduct="codigo_essencia"
      upsellProduct="activation_individual"
      delayMs={5000} // Show after 5 seconds
      showOnce={true}
    />
  );
}
