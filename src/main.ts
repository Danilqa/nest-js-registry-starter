import { NestFactory } from '@nestjs/core';
import { IdentityServiceModule } from './identity-service/identity-service.module';
import { environment } from './environments';
import { TaskServiceModule } from './task-service/task-service.module';

async function bootstrap(): Promise<void> {
    const initIdentity = async () => {
        const app = await NestFactory.create(IdentityServiceModule);
        await app.listen(environment.identity.port);
    }

    const initTask = async () => {
        const app = await NestFactory.create(TaskServiceModule);
        await app.listen(environment.task.port);
    }

    await initIdentity();
    await initTask();
}
bootstrap();
