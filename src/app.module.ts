import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
const { DB_NAME: dbname, DB_USER: dbuser, DB_HOST: dbhost, DB_PORT: dbport } = process.env;
const dburi = `mongodb://${dbuser}@${dbhost}:${dbport}/${dbname}`;

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
