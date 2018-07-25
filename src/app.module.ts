import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { PurchaseModule } from './purchase/purchase.module';
import { UsersModule } from './users/users.module';
import { attachUserToReq } from './middleware/user.middleware';
const { DB_NAME: dbname, DB_USER: dbuser, DB_HOST: dbhost, DB_PORT: dbport } = process.env;
const dburi = `mongodb://${dbhost}:${dbport}/${dbname}`;

@Module({
    imports: [MongooseModule.forRoot(dburi), ProductsModule, PurchaseModule, UsersModule],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(attachUserToReq)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
