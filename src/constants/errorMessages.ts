export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: {
      user: 'Invalid email or password. Please check your credentials and try again.',
      technical: 'Authentication failed: Invalid credentials provided'
    },
    SESSION_EXPIRED: {
      user: 'Your session has expired. Please log in again.',
      technical: 'JWT token expired or invalid'
    },
    UNAUTHORIZED: {
      user: 'You are not authorized to access this resource.',
      technical: 'User lacks required permissions'
    }
  },
  PAYMENT: {
    CARD_DECLINED: {
      user: 'Your card was declined. Please try a different payment method.',
      technical: 'Payment method declined by issuer'
    },
    PAYMENT_TIMEOUT: {
      user: 'Payment processing timed out. Please try again.',
      technical: 'Payment gateway timeout exceeded'
    }
  },
  NETWORK: {
    CONNECTION_ERROR: {
      user: 'Connection error. Please check your internet connection and try again.',
      technical: 'Network request failed'
    },
    SERVER_ERROR: {
      user: 'Server error occurred. Please try again later.',
      technical: 'Internal server error'
    }
  },
  GENERIC: {
    UNKNOWN_ERROR: {
      user: 'An unexpected error occurred. Please try again or contact support.',
      technical: 'Unknown error occurred'
    }
  }
} as const;