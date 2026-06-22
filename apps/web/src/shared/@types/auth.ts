export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface SendOtpPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  user: AuthUser;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
}
