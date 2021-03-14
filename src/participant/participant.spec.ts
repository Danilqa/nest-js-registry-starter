import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ParticipantModule } from './participant.module';
import { ParticipantController } from './participant.controller';
import { Participant, ParticipantDocument } from './schemas/participant.schema';
import { ParticipantDto } from './dto/participant.dto';
import { ParticipantSaveDto } from './dto/participant-save.dto';
import { Model } from 'mongoose';

describe('Participant', () => {
    let app: INestApplication;

    let module: TestingModule;
    let mongoServer: MongoMemoryServer;
    let model: Model<ParticipantDocument>;

    const participantA = generateParticipant('ABC-123');
    const participantB = generateParticipant('ABC-456');

    describe('#creation', () => {

        it('should create a new participant', () => {
            const participantToCreate = generateParticipantToCreate();

            return request(app.getHttpServer())
                .post(`/${ParticipantController.ROOT_PATH}`)
                .send(participantToCreate)
                .expect(HttpStatus.CREATED)
                .expect(response => {
                    expect(response.body).toMatchObject(participantToCreate);
                    expect(response.body.id).not.toBeUndefined();
                });
        });

        it('should not receive a date in invalid format', () => {
            const dataToUpdate = { ...generateParticipantToCreate(), birthdate: '99.99.2020' };
            return request(app.getHttpServer())
                .post(`/${ParticipantController.ROOT_PATH}`)
                .send(dataToUpdate)
                .expect(HttpStatus.BAD_REQUEST)
                .expect(async (response) => {
                    expect(response.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
                    expect(response.body.message).not.toBeUndefined();
                });
        });

        it('should return error if not all fields exist', () => {
            return request(app.getHttpServer())
                .post(`/${ParticipantController.ROOT_PATH}`)
                .send({ name: 'Dan' })
                .expect(HttpStatus.BAD_REQUEST)
                .expect(response => {
                    expect(response.body.message).not.toBeUndefined();
                });
        });
    });

    describe('#retrieving', () => {

        it('should get a list of participants', () => {
            return request(app.getHttpServer())
                .get(`/${ParticipantController.ROOT_PATH}`)
                .expect(HttpStatus.OK)
                .expect(response => {
                    expect(response.body).toEqual([participantA, participantB]);
                });
        });

        it('should get a participant', () => {
            return request(app.getHttpServer())
                .get(`/${ParticipantController.ROOT_PATH}/${participantA.id}`)
                .expect(HttpStatus.OK)
                .expect(response => {
                    expect(response.body).toEqual(participantA);
                });
        });

        it('should return 404 if user is not found', () => {
            return request(app.getHttpServer())
                .get(`/${ParticipantController.ROOT_PATH}/404`)
                .expect(HttpStatus.NOT_FOUND)
                .expect(response => {
                    expect(response.body.statusCode).toEqual(HttpStatus.NOT_FOUND);
                    expect(response.body.message).not.toBeUndefined();
                });
        });
    });

    describe('#deletion', () => {

        it('should delete a participant', () => {
            return request(app.getHttpServer())
                .delete(`/${ParticipantController.ROOT_PATH}/${participantA.id}`)
                .expect(HttpStatus.OK)
                .expect(async () => {
                    const data = await model.findOne({ id: participantA.id }).exec();
                    expect(data).toBeNull();
                });
        });

        it('should return 404 if user is not found', () => {
            return request(app.getHttpServer())
                .delete(`/${ParticipantController.ROOT_PATH}/404`)
                .expect(HttpStatus.NOT_FOUND)
                .expect(response => {
                    expect(response.body.statusCode).toEqual(HttpStatus.NOT_FOUND);
                    expect(response.body.message).not.toBeUndefined();
                });
        });
    });

    describe('#updating', () => {

        it('should update fields of participant', () => {
            const dataToUpdate = { address: '48 Leicester Square', phoneNumber: '+44 20 7930 9442' };
            return request(app.getHttpServer())
                .patch(`/${ParticipantController.ROOT_PATH}/${participantA.id}`)
                .send(dataToUpdate)
                .expect(HttpStatus.OK)
                .expect(async () => {
                    const data = await model.findOne({ id: participantA.id }).exec();
                    expect(data).toMatchObject(dataToUpdate);
                });
        });

        it('should not update id', () => {
            const dataToUpdate = { id: 'someNewId' };
            return request(app.getHttpServer())
                .patch(`/${ParticipantController.ROOT_PATH}/${participantA.id}`)
                .send(dataToUpdate)
                .expect(HttpStatus.OK)
                .expect(async () => {
                    const data = await model.findOne({ id: participantA.id }).exec();
                    expect(data!.id).toEqual(participantA.id);
                });
        });
    });

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        module = await Test.createTestingModule({
            imports: [
                ParticipantModule,
                MongooseModule.forRootAsync({
                    useFactory: async () => ({
                        uri: await mongoServer.getUri()
                    })
                })
            ]
        }).compile();

        app = module.createNestApplication();
        await app.init();

        await mongoose.connect(await mongoServer.getUri());
        model = module.get(getModelToken(Participant.name));
    });

    beforeEach(async () => {
        await model.create(participantA);
        await model.create(participantB);
    });

    afterEach(async () => {
        await model.deleteMany().exec();
    });

    afterAll(async () => {
        await module.close();
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterAll(async () => {
        await app.close();
    });

    function generateParticipant(id?: string): Partial<ParticipantDto> {
        return { id, ...generateParticipantToCreate() };
    }

    function generateParticipantToCreate(): Partial<ParticipantSaveDto> {
        return {
            name: 'Harry Potter',
            birthdate: '2011-08-12T20:17:46.384Z',
            phoneNumber: '+44 141 243 2640',
            address: '44 Howard Street Merchant City, Glasgow G1 4EE Scotland'
        };
    }
});