import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { environment } from './environments';
import { UserModule } from './user/user.module';

const { db } = environment;

@Module({
    imports: [
        AuthModule,
        UserModule,
        MongooseModule.forRoot(
            `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.dbname}`
        )
    ]
})
export class AppModule {
}
