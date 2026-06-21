import { accessTokenName } from '@shared/constants/jwt.constants';
import type { Request } from 'express';
export const extractTokenFromCookie = (request: Request) => {
  return request.cookies?.[accessTokenName]
    ? request.cookies[accessTokenName]
    : undefined;
};
