import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL,
  environment: process.env.NODE_ENV,
}));
