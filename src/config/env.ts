interface EnvConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  isDevelopment: boolean;
  isProduction: boolean;
}

function validateEnv(): EnvConfig {
  const environment = import.meta.env.MODE as 'development' | 'production' | 'staging';
  const configuredApiUrl = import.meta.env.VITE_API_URL as string | undefined;
  const fallbackApiUrl = 'http://localhost:8080/api/v1';
  const apiUrl = configuredApiUrl || fallbackApiUrl;

  if (environment === 'production' && !configuredApiUrl) {
    throw new Error('VITE_API_URL must be set in production');
  }

  // Validate URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(apiUrl);
  } catch {
    throw new Error(`Invalid API URL: ${apiUrl}`);
  }

  if (environment === 'production') {
    const localHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0']);
    if (localHosts.has(parsedUrl.hostname)) {
      throw new Error(`Production API URL cannot point to localhost: ${apiUrl}`);
    }
  }

  return {
    apiUrl,
    environment,
    isDevelopment: environment === 'development',
    isProduction: environment === 'production'
  };
}

export const env = validateEnv();
