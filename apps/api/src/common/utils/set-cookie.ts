import { CookieOptions } from '@shared/@types/cookie-options';
import { Response } from 'express';

export function setCookies(res: Response, cookies: CookieOptions[]): void {
  cookies.forEach((cookie) => {
    res.cookie(cookie.name, cookie.value, cookie.options || {});
  });
}
