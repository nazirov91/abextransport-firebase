export function resolveFunctionUrl(functionName: string, fallbackPath: string) {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const region = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1';
  const useEmulator =
    import.meta.env.DEV && String(import.meta.env.VITE_USE_FUNCTIONS_EMULATOR).toLowerCase() === 'true';

  if (useEmulator && projectId) {
    const protocol = import.meta.env.VITE_FIREBASE_EMULATOR_PROTOCOL || 'http';
    const host = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1';
    const port = import.meta.env.VITE_FIREBASE_FUNCTIONS_PORT || '5001';
    return `${protocol}://${host}:${port}/${projectId}/${region}/${functionName}`;
  }

  if (projectId) {
    return `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
  }

  return fallbackPath;
}
