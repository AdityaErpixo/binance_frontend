export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  phone?: string;
  referralCode?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  twoFACode?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    emailVerified: boolean;
    twoFAEnabled: boolean;
  };
}