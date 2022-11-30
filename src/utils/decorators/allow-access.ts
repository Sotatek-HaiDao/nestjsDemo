import { SetMetadata } from '@nestjs/common';

export const AllowAccess = (loginType: string) => SetMetadata('login_type_allow_access', loginType);