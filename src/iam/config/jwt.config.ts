import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  issuer: process.env.JWT_TOKEN_ISSUER,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600000', 10),
}));
