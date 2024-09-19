import { Injectable } from '@nestjs/common';
import { DATABASE_INSTANCE } from 'src/config/database/database.constants';
import { UserBodyDto } from './dto/create-user-body.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { createUserType } from './interface/user';
import { InjectRepository } from '@mikro-orm/nestjs';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, DATABASE_INSTANCE.MASTER)
    private readonly userRepository,
  ) {}

  async createUser(userBodyDto: UserBodyDto): Promise<createUserType> {
    const { fullname, email, password } = userBodyDto;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    await this.userRepository.insert({
      email,
      password: hashedPassword,
      full_name: fullname,
    });

    return { message: 'user created successfully' };
  }
  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }
}
