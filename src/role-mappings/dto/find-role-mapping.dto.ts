import { IsMongoId, IsOptional } from 'class-validator';

export class FindRoleMappingDto {
    @IsOptional()
    @IsMongoId()
    readonly userId?: string;

    @IsOptional()
    @IsMongoId()
    readonly roleId?: string;

    constructor(userId?: string, roleId?: string) {
        if (userId) this.userId = userId;
        if (roleId) this.roleId = roleId;
    }
}
