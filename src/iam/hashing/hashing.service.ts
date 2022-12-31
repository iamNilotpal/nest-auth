import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(data: string | Buffer, rounds?: number): Promise<string>;
  abstract compare(data: string | Buffer, hashedData: string): Promise<boolean>;
}
