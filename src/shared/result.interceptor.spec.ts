import { ResultInterceptor } from './result.interceptor';
import { AppModule } from '../app.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { response } from 'express';

function createTestModule(interceptor) {
  return Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useValue: interceptor,
      },
    ],
  }).compile();
}

describe('ResultInterceptor', () => {
  let app: INestApplication;
  it('should be defined', async () => {
    expect(new ResultInterceptor()).toBeDefined();
  });
  it('should return response call with correct url', async () => {
    const response = {
      code: 200,
      data: {
        createdAt: expect.any(Number),
        id: expect.any(String),
        title: 'test',
        content: 'test',
        isActive: true,
        updatedAt: expect.any(Number),
      },
      message: 'success',
    };
    app = (
      await createTestModule(new ResultInterceptor())
    ).createNestApplication();
    await app.init();
    return request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'test', content: 'test' })
      .expect(response);
  });
});
