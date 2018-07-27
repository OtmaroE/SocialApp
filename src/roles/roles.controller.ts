import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './interfaces/role.interface';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    findAll(): Promise<Role[]> {
        return this.rolesService.findAll();
    }

    @Post()
    create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return this.rolesService.create(createRoleDto);
    }
}
