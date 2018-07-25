import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, UseGuards } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UserService } from './users.service';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';

@Controller('users')
@UseGuards(RoleGuard)
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
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  create(@Body() usersDto: UsersDto) {
    return this.userService.signup(usersDto);
  }
}