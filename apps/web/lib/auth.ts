import {
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "../types/auth";
import { api } from "./api-client";

export async function sendOtp(
  payload: SendOtpPayload,
): Promise<SendOtpResponse> {
  return api.post<SendOtpResponse>("/auth/sendOtp", payload);
}

export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> {
  // بک‌اند httpOnly cookie ست می‌کنه — ما فقط user info رو می‌گیریم
  return api.post<VerifyOtpResponse>("/auth/verifyOtp", payload);
}
