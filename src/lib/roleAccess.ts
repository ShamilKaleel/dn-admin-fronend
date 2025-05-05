// src/lib/roleAccess.ts

// Define role constants
export const ROLE_ADMIN = "ROLE_ADMIN";
export const ROLE_DENTIST = "ROLE_DENTIST";
export const ROLE_RECEPTIONIST = "ROLE_RECEPTIONIST";

// Define route access mapping
const routeAccessMap: Record<string, string[]> = {
  // Dashboard accessible to all
  "/": [ROLE_ADMIN, ROLE_DENTIST, ROLE_RECEPTIONIST],

  // Admin page only for admin role
  "/admin": [ROLE_ADMIN],

  // Dentist page for admin only (as per requirements)
  "/dentist": [ROLE_ADMIN],

  // Patient page for admin and dentist only (as per requirements)
  "/patient": [ROLE_ADMIN, ROLE_DENTIST],

  // Receptionist page for admin only (as per requirements)
  "/receptionist": [ROLE_ADMIN],

  // Common pages accessible to all roles
  "/schedule": [ROLE_ADMIN, ROLE_DENTIST, ROLE_RECEPTIONIST],
  "/appointment-list": [ROLE_ADMIN, ROLE_DENTIST, ROLE_RECEPTIONIST],
  "/feedback": [ROLE_ADMIN, ROLE_DENTIST, ROLE_RECEPTIONIST],
  "/contact-us": [ROLE_ADMIN, ROLE_DENTIST, ROLE_RECEPTIONIST],

  // Profile page accessible to all roles
  "/profile": [ROLE_ADMIN, ROLE_DENTIST, ROLE_RECEPTIONIST],
};

/**
 * Checks if a user with the given roles has access to a specific path
 * @param userRoles Array of user roles
 * @param path Route path to check access for
 * @returns boolean indicating whether the user has access
 */
export const hasAccess = (userRoles: string[], path: string): boolean => {
  // If path doesn't exist in our mapping, deny access by default
  if (!routeAccessMap[path]) {
    return false;
  }

  // Check if any of the user's roles grant access to this path
  return userRoles.some((role) => routeAccessMap[path].includes(role));
};

/**
 * Gets all accessible routes for a user with the given roles
 * @param userRoles Array of user roles
 * @returns Array of paths the user can access
 */
export const getAccessibleRoutes = (userRoles: string[]): string[] => {
  return Object.entries(routeAccessMap)
    .filter(([_, allowedRoles]) =>
      userRoles.some((role) => allowedRoles.includes(role))
    )
    .map(([path, _]) => path);
};

/**
 * Determines if a user has admin privileges
 * @param userRoles Array of user roles
 * @returns boolean indicating whether the user has admin role
 */
export const isAdmin = (userRoles: string[]): boolean => {
  return userRoles.includes(ROLE_ADMIN);
};

/**
 * Determines if a user is a dentist
 * @param userRoles Array of user roles
 * @returns boolean indicating whether the user has dentist role
 */
export const isDentist = (userRoles: string[]): boolean => {
  return userRoles.includes(ROLE_DENTIST);
};

/**
 * Determines if a user is a receptionist
 * @param userRoles Array of user roles
 * @returns boolean indicating whether the user has receptionist role
 */
export const isReceptionist = (userRoles: string[]): boolean => {
  return userRoles.includes(ROLE_RECEPTIONIST);
};
