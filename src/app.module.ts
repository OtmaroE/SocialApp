import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { PurchaseModule } from './purchase/purchase.module';
const { DB_NAME: dbname, DB_USER: dbuser, DB_HOST: dbhost, DB_PORT: dbport } = process.env;
const dburi = `mongodb://${dbhost}:${dbport}/${dbname}`;

@Module({
    imports: [MongooseModule.forRoot(dburi), ProductsModule, PurchaseModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
