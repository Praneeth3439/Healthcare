export type UserRole = 'Patient' | 'Student' | 'Healthcare Professional' | 'General User';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  userType: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
