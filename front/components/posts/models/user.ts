export interface User {
  id: number;
  name: string;
  iconUrl: string;
  signedUrl: string;
}

export interface NewUser {
  loginId: string;
  name: string;
  password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  loginId: string;
  iconUrl?: string;
  signedUrl?: string;
}
