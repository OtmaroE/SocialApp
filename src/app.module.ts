import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
const { DB_NAME: dbname, DB_USER: dbuser, DB_HOST: dbhost, DB_PORT: dbport } = process.env;
const dburi = `mongodb://${dbuser}@${dbhost}:${dbport}/${dbname}`;

@Module({
    imports: [MongooseModule.forRoot(dburi)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
