import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipantModule } from './participant/participant.module';
import { environment } from './environments';

const { db } = environment;

@Module({
    imports: [
        ParticipantModule,
        MongooseModule.forRoot(
            `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.dbname}`
        )
    ]
})
export class AppModule {
}