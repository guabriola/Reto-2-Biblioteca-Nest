//Custom decorator for publics routes - Enable authentication globally
//https://docs.nestjs.com/recipes/passport#enable-authentication-globally

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);