import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { attachUserToReq } from './middleware/user.middleware';

const { MONGO_URI } = process.env;

@Module({
    imports: [MongooseModule.forRoot(MONGO_URI, { useNewUrlParser: true }), UsersModule],
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
