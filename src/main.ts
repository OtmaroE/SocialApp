import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
        .setTitle('Bistec API')
        .setDescription('Owed payment record keeping for `el bistec`')
        .setVersion('1.0')
        .addBearerAuth('Authorization','header')
        .setBasePath('api')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('explorer', app, document);

    app.setGlobalPrefix('api');
    await app.listen(3000);
}
bootstrap();
