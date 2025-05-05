export interface User {
  username: string;
  roles: string[];
}

export interface UserProfile extends User {
  id?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  phoneNumber?: string;
  nic?: string;
  specialization?: string; // For dentists
  licenseNumber?: string; // For dentists
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdateRequest {
  userName?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  phoneNumber?: string;
  nic?: string;
  specialization?: string; // For dentists
  licenseNumber?: string; // For dentists
}
