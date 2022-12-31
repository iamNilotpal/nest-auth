import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer, rounds?: number): Promise<string> {
    const salt = await genSalt(rounds || 15);
    return hash(data, salt);
  }

  compare(data: string | Buffer, hashedData: string): Promise<boolean> {
    return compare(data, hashedData);
  }
}
