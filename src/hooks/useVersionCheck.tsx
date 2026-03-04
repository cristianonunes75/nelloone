/**
 * Version check hook — DISABLED.
 * Previously auto-detected new bundles and showed a toast / forced reload.
 * Disabled because it caused constant "Nova versão disponível" interruptions.
 * A full-page reload via the PWA service-worker update prompt is sufficient.
 */
export const useVersionCheck = () => {
  // Intentionally empty — no version polling, no toasts, no reloads.
};
