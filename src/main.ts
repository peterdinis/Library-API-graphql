import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'fatal', 'log'],
    });
    
    const config = new DocumentBuilder()
        .setTitle('SPŠT API 2.0')
        .setVersion('1.0')
        .build();
    app.enableCors();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(5000);
}
bootstrap();
