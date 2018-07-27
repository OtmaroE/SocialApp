import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenSchema } from './schemas/user-access-token.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'AccessToken', schema: AccessTokenSchema }])],
    providers: [AuthService],
    exports: [
        AuthService,
        MongooseModule.forFeature([{ name: 'AccessToken', schema: AccessTokenSchema }]),
    ],
})
export class AuthModule { }
