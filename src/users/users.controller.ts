import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, UseGuards, Put, Patch, Param, Req } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UserService } from './users.service';
import { RoleGuard } from 'authentication/auth.guard';
import { Roles } from 'authentication/auth.decorator';
import { ValidateLimit } from './pipes/limit-validate.pipe';
import { ValidateMongoId } from 'pipes/validate-mongoId.pipe';
import { ValidateToken } from '../authentication/validatetoken.decorator';
import { TokenGuard } from '../authentication/validtoken.guard';
import { HashPasswordPipe } from 'pipes/hash-password.pipe';
import { CreateUser } from './dto/create-user.dto';

@Controller('users')
@UseGuards(RoleGuard, TokenGuard)
export class UsersController {
    constructor(private readonly userService: UserService) { }
    @Post('login')
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    login(@Body() usersDto: UsersDto) {
        return this.userService.login(usersDto);
    }
    @Post('logout')
    @ValidateToken()
    logout(@Req() req) {
        const { user: { uuid } } = req;
        return this.userService.logout(uuid);
    }
    @Post()
    @UsePipes(new ValidationPipe(), new HashPasswordPipe())
    create(@Body() user: CreateUser) {
        return this.userService.signup(user);
    }
    @Put()
    @ValidateToken()
    @Roles('admin')
    updateGlobalDebtLimit(@Body('limit', new ValidateLimit()) limit) {
        return this.userService.updateCreditLimit(limit);
    }
    @Patch(':id')
    @ValidateToken()
    @Roles('admin')
    updateCreditLimit(@Param('id', new ValidateMongoId()) user, @Body('limit', new ValidateLimit()) limit) {
        return this.userService.updateOneUserCreditLimit(user, limit);
    }
}
