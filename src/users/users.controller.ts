import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<User[]> {
    return await this.usersService.findAll({ limit, skip });
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Get('by-email')
  async findOneByEmail(@Body() emailDto: FindByEmailDto): Promise<User> {
    return await this.usersService.findOneByEmail(emailDto.email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
