interface EnvConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  isDevelopment: boolean;
  isProduction: boolean;
}

function validateEnv(): EnvConfig {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
  const environment = import.meta.env.MODE as 'development' | 'production' | 'staging';

  // Validate URL format
  try {
    new URL(apiUrl);
  } catch {
    throw new Error(`Invalid API URL: ${apiUrl}`);
  }

  return {
    apiUrl,
    environment,
    isDevelopment: environment === 'development',
    isProduction: environment === 'production'
  };
}

export const env = validateEnv();