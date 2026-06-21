import { Roles } from '@shared/enums/role-app.enum';

export type JwtPayload = {
  sub: string;
  role: Roles;
  permissions: string[];
};
