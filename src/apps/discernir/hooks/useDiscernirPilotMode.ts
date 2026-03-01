/**
 * DISCERNIR Pilot Mode
 * When true, only "Perfil de Serviço" is available.
 * Set VITE_DISCERNIR_PILOT_MODE=false to restore all modules.
 */
export function useDiscernirPilotMode(): boolean {
  const envValue = import.meta.env.VITE_DISCERNIR_PILOT_MODE;
  // Default to true (pilot mode ON) if not set
  if (envValue === undefined || envValue === '') return true;
  return envValue !== 'false';
}
