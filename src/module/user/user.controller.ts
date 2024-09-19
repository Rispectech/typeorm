import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserApi, UserApiPath, UserApiTags } from './user.constants';
import { UserService } from './user.service';
import { UserBodyDto } from './dto/create-user-body.dto';
import { createUserType } from './interface/user';
@ApiTags(UserApiTags.API_TAG)
@Controller(UserApi.CONTROLLER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(UserApiPath.CREATE_USER)
  async createUser(@Body() userBodyDto: UserBodyDto): Promise<createUserType> {
    return await this.userService.createUser(userBodyDto);
  }
}
