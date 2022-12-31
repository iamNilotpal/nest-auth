import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { TokenGuard } from './auth/guards/token.guard';
import { TokenService } from './auth/token.service';
import jwtConfig from './config/jwt.config';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider() as JwtModuleAsyncOptions),
  ],
  controllers: [AuthController],
  providers: [
    TokenGuard,
    AuthService,
    TokenService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: HashingService, useClass: BcryptService },
  ],
})
export class IamModule {}
