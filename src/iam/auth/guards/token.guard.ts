import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenService } from '../token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) return false;

    const payload = await this.tokenService.verifyToken(token, 'ACCESS_TOKEN');
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    console.log({ user, payload });

    if (!user) return false;
    request[REQUEST_USER_KEY] = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const bearer = request.headers.authorization?.split(' ');
    if (!bearer || bearer.length < 2) return undefined;

    const [_, token] = bearer;
    return token;
  }
}
