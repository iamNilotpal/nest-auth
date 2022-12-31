import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { JwtErrorNames } from './enums/jwt-errors.enum';
import { JwtPayload } from './types/jwt-payload';
import { TokenResponse } from './types/login-response';
import { TOKEN_TYPE } from './types/tokens-type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private async signToken(payload: JwtPayload, type: TOKEN_TYPE) {
    return this.jwtService.signAsync(payload, {
      issuer: this.jwtConfiguration.issuer,
      audience: this.jwtConfiguration.audience,
      expiresIn:
        type === 'ACCESS_TOKEN'
          ? this.jwtConfiguration.accessTokenTTL
          : this.jwtConfiguration.refreshTokenTTL,
      secret:
        type === 'ACCESS_TOKEN'
          ? this.jwtConfiguration.accessTokenSecret
          : this.jwtConfiguration.refreshTokenSecret,
    });
  }

  async signTokens(payload: JwtPayload): Promise<TokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, 'ACCESS_TOKEN'),
      this.signToken(payload, 'REFRESH_TOKEN'),
    ]);
    return { accessToken, refreshToken };
  }

  async verifyToken(token: string, type: TOKEN_TYPE): Promise<JwtPayload> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret:
          type === 'ACCESS_TOKEN'
            ? this.jwtConfiguration.accessTokenSecret
            : this.jwtConfiguration.refreshTokenSecret,
      });
      return payload;
    } catch (error) {
      if (error.name === JwtErrorNames.TokenExpiredError)
        throw new BadGatewayException('Session expired. Login again.');

      if (error.name === JwtErrorNames.JsonWebTokenError)
        throw new BadGatewayException('Invalid token.');

      throw error;
    }
  }
}
