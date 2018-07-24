import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() usersDto: UsersDto) {
    return this.userService.login(usersDto);
  }
  @Post('logout')
  logout() {
    return;
  }
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() usersDto: UsersDto) {
    return this.userService.signup(usersDto);
  }
}