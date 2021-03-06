import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    await app.listen(environment.port);
}
bootstrap();