import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_ERROR_CODES } from 'src/common/constants/pg.error-codes';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenService } from './token.service';
import { TokenResponse } from './types/login-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashingService,
    private readonly tokenService: TokenService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signUp(signupDto: SignUpDto): Promise<User> {
    try {
      const hashedPassword = await this.hashService.hash(signupDto.password);
      const user = this.userRepository.create({
        ...signupDto,
        password: hashedPassword,
      });

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === PG_ERROR_CODES.CONFLICT)
        throw new ConflictException('Email is already registered.');
      throw error;
    }
  }

  async signIn(signinDto: SignInDto): Promise<TokenResponse> {
    const user = await this.userRepository.findOne({
      where: { email: signinDto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password.');
    const isMatch = await this.hashService.compare(
      signinDto.password,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid email or password.');

    const { accessToken, refreshToken } = await this.tokenService.signTokens({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, refreshToken };
  }
}
