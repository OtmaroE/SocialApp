import { createParamDecorator } from '@nestjs/common';

export const user = createParamDecorator((data, req) => {
  return req.user[data] || req.user;
});