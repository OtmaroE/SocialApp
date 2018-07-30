import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'products/products.module';
import { PurchaseModule } from 'purchase/purchase.module';
import { UsersModule } from 'users/users.module';
import { PaymentModule } from 'payment/payment.module';
import { AuthModule } from 'auth/auth.module';
import { RoleMappingsModule } from 'role-mappings/role-mappings.module';
import { RolesModule } from 'roles/roles.module';
const { MONGO_URI } = process.env;

@Module({
    imports: [
        MongooseModule.forRoot(MONGO_URI),
        ProductsModule,
        PurchaseModule,
        UsersModule,
        PaymentModule,
        AuthModule,
        RoleMappingsModule,
        RolesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}
