export interface Receptionist {
  id: string;
  userName: string;
  email: string;
  gender: string;
  firstName: string;
  phoneNumber: string;
  nic: string;
  shiftTiming: string;
  roles: string[];
}

export interface CreateReceptionist {
  userName: string;
  email: string;
  gender: string;
  password: string;
  firstName: string;
  nic: string;
  phoneNumber: string;
  shiftTiming: string;
}
