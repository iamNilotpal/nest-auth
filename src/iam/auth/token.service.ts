import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { JwtPayload } from './types/jwt-payload';
import { TokenResponse } from './types/login-response';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signTokens(payload: JwtPayload): Promise<TokenResponse> {
    const accessToken = await this.jwtService.signAsync(payload, {
      issuer: this.jwtConfiguration.issuer,
      audience: this.jwtConfiguration.audience,
      expiresIn: this.jwtConfiguration.accessTokenTTL,
      secret: this.jwtConfiguration.accessTokenSecret,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      issuer: this.jwtConfiguration.issuer,
      audience: this.jwtConfiguration.audience,
      expiresIn: this.jwtConfiguration.refreshTokenTTL,
      secret: this.jwtConfiguration.refreshTokenSecret,
    });

    return { accessToken, refreshToken };
  }
}
