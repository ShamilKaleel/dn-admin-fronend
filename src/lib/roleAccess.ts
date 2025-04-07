// Define accessible pages by role
export const accessiblePages = {
  ROLE_ADMIN: [
    "/",
    "/admin",
    "/dentist",
    "/patient",
    "/receptionist",
    "/schedule",
    "/appointment-list",
    "/feedback",
    "/contact-us",
  ],
  ROLE_DENTIST: [
    "/",
    "/patient",
    "/schedule",
    "/appointment-list",
    "/feedback",
    "/contact-us",
  ],
  ROLE_RECEPTIONIST: [
    "/",
    "/appointment-list",
    "/feedback",
    "/contact-us",
    "/schedule",
  ],
};

// Check if user has access to a specific path
export const hasAccess = (roles: string[], path: string): boolean => {
  if (!roles || roles.length === 0) return false;

  // Check if any of the user's roles grant access to the path
  return roles.some((role) => {
    const accessiblePathsForRole =
      accessiblePages[role as keyof typeof accessiblePages] || [];

    // Main page check
    const mainPath = path.split("/").filter((p) => p)[0];
    const fullPath = mainPath ? `/${mainPath}` : "/";

    return accessiblePathsForRole.includes(fullPath);
  });
};
