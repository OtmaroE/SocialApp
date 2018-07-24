import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  login(@Body() usersDto: UsersDto) {
    return this.userService.login(usersDto);
  }

  @Post('logout')
  logout() {
    return;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() usersDto: UsersDto) {
    return this.userService.signup(usersDto);
  }
}