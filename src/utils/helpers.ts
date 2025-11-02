type UserType = 'MERCHANT' | 'ADMIN';

/**
 * Type guard to check if a string is a valid UserType
 */
function isValidUserType(value: string): value is UserType {
  return value === 'MERCHANT' || value === 'ADMIN';
}

/**
 * Normalizes user type from backend format to frontend format
 * Handles formats like: [ROLE_MERCHANT], ROLE_MERCHANT, MERCHANT, or arrays
 * 
 * @param userType - The user type from backend (string, array, or undefined)
 * @returns Normalized user type or 'MERCHANT' as fallback
 */
export function normalizeUserType(userType: unknown): UserType {
  try {
    // Handle null/undefined
    if (!userType) {
      return 'MERCHANT';
    }

    // Handle array of roles (take first valid role)
    if (Array.isArray(userType)) {
      for (const role of userType) {
        const normalized = normalizeUserType(role);
        if (normalized) return normalized;
      }
      return 'MERCHANT';
    }

    // Convert to string and normalize
    const roleString = String(userType).trim();
    
    // Remove brackets and ROLE_ prefix
    const cleaned = roleString
      .replace(/^\[/, '')           // Remove opening bracket
      .replace(/\]$/, '')           // Remove closing bracket
      .replace(/^ROLE_/, '')        // Remove ROLE_ prefix
      .toUpperCase();

    // Validate and return
    if (isValidUserType(cleaned)) {
      return cleaned;
    }

    // Fallback for unrecognized formats
    console.warn(`Unrecognized user type format: ${roleString}, defaulting to MERCHANT`);
    return 'MERCHANT';
    
  } catch (error) {
    console.error('Error normalizing user type:', error);
    return 'MERCHANT';
  }
}

/**
 * Extracts all normalized roles from backend format
 * 
 * @param roles - Roles from backend (string, array, or undefined)
 * @returns Array of normalized user types
 */
export function normalizeUserRoles(roles: unknown): UserType[] {
  if (!roles) return ['MERCHANT'];
  
  if (Array.isArray(roles)) {
    const normalized = roles
      .map(role => normalizeUserType(role))
      .filter((role, index, arr) => arr.indexOf(role) === index); // Remove duplicates
    
    return normalized.length > 0 ? normalized : ['MERCHANT'];
  }
  
  return [normalizeUserType(roles)];
}