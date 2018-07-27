import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, UseGuards, Put, Patch, Param, Req } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UserService } from './users.service';
import { RoleGuard } from 'authentication/auth.guard';
import { Roles } from 'authentication/auth.decorator';
import { ValidateLimit } from './pipes/limit-validate.pipe';
import { ValidateMongoId } from 'pipes/validate-mongoId.pipe';
import { ValidateToken } from '../authentication/validatetoken.decorator';
import { TokenGuard } from '../authentication/validtoken.guard';
import { ApiUseTags, ApiOAuth2Auth, ApiResponse, ApiImplicitHeader, ApiBearerAuth, ApiImplicitBody } from '@nestjs/swagger';

@Controller('users')
@UseGuards(RoleGuard, TokenGuard)
@ApiUseTags('Users')
export class UsersController {
    constructor(private readonly userService: UserService) { }
    @Post('login')
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Login accepted and token generated.' })
    login(@Body() usersDto: UsersDto) {
        return this.userService.login(usersDto);
    }
    @Post('logout')
    @ApiBearerAuth()
    @ValidateToken()
    logout(@Req() req) {
      const { user: { uuid } } = req;
      return this.userService.logout(uuid);
    }
    @Post()
    @UsePipes(new ValidationPipe())
    @ApiBearerAuth()
    create(@Body() usersDto: UsersDto) {
      return this.userService.signup(usersDto);
    }
    @Put()
    @ValidateToken()
    @Roles('admin')
    @ApiBearerAuth()
    @ApiImplicitBody({ name: 'limit', description: 'new limit for user.', type: Number })
    updateGlobalDebtLimit(@Body('limit', new ValidateLimit()) limit) {
      return this.userService.updateCreditLimit(limit);
    }
    @Patch(':id')
    @ValidateToken()
    @Roles('admin')
    @ApiBearerAuth()
    updateCreditLimit(@Param('id', new ValidateMongoId()) user, @Body('limit', new ValidateLimit()) limit) {
      return this.userService.updateOneUserCreditLimit(user, limit);
    }
}
