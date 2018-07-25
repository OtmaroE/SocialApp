import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, UseGuards, Put, BadRequestException, Req, Patch, Param } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UserService } from './users.service';
import { RoleGuard } from 'authentication/auth.guard';
import { Roles } from 'authentication/auth.decorator';
import { ValidateLimit } from './pipes/limit-validate.pipe';
import { ValidateMongoId } from 'pipes/validate-mongoId.pipe';

@Controller('users')
@UseGuards(RoleGuard)
export class UsersController {
    constructor(private readonly userService: UserService) { }
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
    @Put()
    @Roles('admin')
    updateGlobalDebtLimit(@Body('limit', new ValidateLimit()) limit) {
      return this.userService.updateCreditLimit(limit);
    }
    @Patch(':id')
    @Roles('admin')
    updateCreditLimit(@Param('id', new ValidateMongoId()) user, @Body('limit', new ValidateLimit()) limit) {
      return this.userService.updateOneUserCreditLimit(user, limit);
    }
}
