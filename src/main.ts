import { NestFactory } from '@nestjs/core';
import { IdentityServiceModule } from './identity-service/identity-service.module';
import { environment } from './environments';
import { TaskServiceModule } from './task-service/task-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
    const initIdentity = async () => {
        const options = new DocumentBuilder()
            .setTitle('Identity')
            .setDescription('Stores users and provides authn and authz logics for them')
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                'access-token',
            )
            .setVersion('1.0')
            .build();

        const app = await NestFactory.create(IdentityServiceModule);
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);
        await app.listen(environment.identity.port);
    };

    const initTask = async () => {
        const options = new DocumentBuilder()
            .setTitle('Task')
            .setDescription('Contains all processes related to the task management')
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                'access-token',
            )
            .setVersion('1.0')
            .build();

        const app = await NestFactory.create(TaskServiceModule);
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);
        await app.listen(environment.task.port);
    };

    initIdentity();
    initTask();
}

bootstrap();
