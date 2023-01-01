import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_ERROR_CODES } from 'src/common/constants/pg.error-codes';
import { FindOneOptions, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async findOne(filter: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(filter);
  }

  async findAll(paginationDto: PaginationDto): Promise<User[]> {
    const { limit, skip } = paginationDto;
    return this.userRepository.find({
      skip,
      take: limit <= 20 ? limit : 20,
    });
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} doesn't exist`);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException(`User with email ${email} doesn't exist`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const { affected } = await this.userRepository.update(id, {
      ...updateUserDto,
    });
    if (affected === PG_ERROR_CODES.NOT_AFFECTED)
      throw new BadRequestException("User does't exist.");
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.userRepository.delete({ id });
    if (affected === PG_ERROR_CODES.NOT_AFFECTED)
      throw new BadRequestException("User does't exist.");
  }
}
