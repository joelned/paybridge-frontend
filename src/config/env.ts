// src/config/env.ts - NEW FILE
interface EnvConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  isDevelopment: boolean;
  isProduction: boolean;
}

function validateEnv(): EnvConfig {
  const apiUrl = import.meta.env.VITE_API_URL;
  const environment = import.meta.env.MODE as 'development' | 'production' | 'staging';

  // Validate required environment variables
  if (!apiUrl) {
    throw new Error('VITE_API_URL is required in environment variables');
  }

  // Validate URL format
  try {
    new URL(apiUrl);
  } catch {
    throw new Error(`Invalid VITE_API_URL: ${apiUrl}`);
  }

  return {
    apiUrl,
    environment,
    isDevelopment: environment === 'development',
    isProduction: environment === 'production'
  };
}

export const env = validateEnv();

// ============================================
// .env.example - CREATE THIS FILE
// ============================================
/*
# API Configuration
VITE_API_URL=http://localhost:8080/api/v1

# Environment
NODE_ENV=development
*/

// ============================================
// .env.production - CREATE THIS FILE
// ============================================
/*
# API Configuration
VITE_API_URL=https://api.paybridge.com/api/v1

# Environment
NODE_ENV=production
*/