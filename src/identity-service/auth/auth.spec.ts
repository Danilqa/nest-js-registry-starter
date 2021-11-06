import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';
import { User, UserDocument } from '../user/user.schema';
import { UserSaveDto } from '../user/dto/user-save.dto';
import { UserRole } from '../user/user.enums';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

describe('Auth', () => {
    let app: INestApplication;

    let module: TestingModule;
    let mongoServer: MongoMemoryServer;
    let model: Model<UserDocument>;

    const userA: UserSaveDto = { name: 'popug-1', password: '123', role: UserRole.MANAGER };
    const existingUser: UserSaveDto = { name: 'popug-ravshan', password: '456', role: UserRole.WORKER };

    describe('#creation', () => {

        it('should create a new user', () => {
            return request(app.getHttpServer())
                .post(`/${UserController.ROOT_PATH}`)
                .send(userA)
                .expect(HttpStatus.CREATED)
                .expect(response => {
                    expect(response.body.name).toBe(userA.name);
                    expect(response.body.role).toBe(userA.role);
                    expect(response.body.password).toBeUndefined();
                    expect(response.body.secret).toBeUndefined();
                });
        });

        it('should successfully login', () => {
            return request(app.getHttpServer())
                .post(`/${AuthController.ROOT_PATH}/login`)
                .send({ name: 'popug-ravshan', password: '456' })
                .expect(HttpStatus.OK)
                .expect(response => {
                    expect(response.body.token).toBeDefined();
                });
        });

        it('should throw login error if password is not valid', () => {
            return request(app.getHttpServer())
                .post(`/${AuthController.ROOT_PATH}/validate`)
                .send({ name: 'popug-ravshan', password: 'wrong-password' })
                .expect(HttpStatus.UNAUTHORIZED)
                .expect(res => {
                    expect(res.body.message).toBe('Token is not valid');
                });
        });

        it('should validate user', async () => {
            const data = await request(app.getHttpServer())
                .post(`/${AuthController.ROOT_PATH}/login`)
                .send({ name: 'popug-ravshan', password: '456' });

            return request(app.getHttpServer())
                .post(`/${AuthController.ROOT_PATH}/validate`)
                .send({ token: data.body.token })
                .expect(HttpStatus.OK)
                .expect(res => {
                    expect(res.body).toEqual({});
                });
        });
    });

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        module = await Test.createTestingModule({
            imports: [
                AuthModule,
                UserModule,
                MongooseModule.forRootAsync({
                    useFactory: () => ({
                        uri: mongoServer.getUri()
                    })
                })
            ]
        }).compile();

        app = module.createNestApplication();
        await app.init();

        await mongoose.connect(mongoServer.getUri());
        model = module.get(getModelToken(User.name));
    });

    beforeEach(async () => {
        await request(app.getHttpServer())
            .post(`/${UserController.ROOT_PATH}`)
            .send(existingUser);
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
});
