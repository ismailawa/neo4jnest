import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;
  let spyService: CommentsService;
  beforeEach(async () => {
    const CommonServiceProvider = {
      provide: CommentsService,
      useFactory: () => ({
        create: jest.fn(() => ({ test: 'test' })),
        findAll: jest.fn(() => ({ test: 'test' })),
        findOne: jest.fn(() => ({ test: 'test' })),
        update: jest.fn(() => ({ test: 'test' })),
        remove: jest.fn(() => ({ test: 'test' })),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [CommentsService, CommonServiceProvider],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    spyService = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('Create Comment', () => {
    it('should call create comment', async () => {
      const payload = {
        content: 'test content',
        postId: '66663',
        isActive: true,
      };
      controller.create(payload);
      expect(spyService.create).toHaveBeenCalled();
    });
    it('should  create  new comment', async () => {
      const payload = {
        content: 'test content',
        postId: '66663',
        isActive: true,
      };
      controller.create(payload);
      expect(spyService.create(payload)).toEqual({ test: 'test' });
    });
  });

  describe('Get All Comments', () => {
    it('should call get all comments', async () => {
      controller.findAll();
      expect(spyService.findAll).toHaveBeenCalled();
    });

    it('should  get all comments', async () => {
      controller.findAll();
      expect(spyService.findAll()).toEqual({ test: 'test' });
    });
  });
  describe('Get A Comment', () => {
    const id = '3ert34';
    it('should call get comment', async () => {
      controller.findOne(id);
      expect(spyService.findOne).toHaveBeenCalled();
    });
    it('should get single comment', () => {
      expect(spyService.findOne(id)).toEqual({ test: 'test' });
    });
  });
  describe('Update Comment', () => {
    const id = '3ert34';
    const payload = {
      content: 'test content',
    };
    it('should call update comment', async () => {
      controller.update(id, payload);
      expect(spyService.update).toHaveBeenCalled();
    });
    it('should update comment', () => {
      expect(spyService.update(id, payload)).toEqual({ test: 'test' });
    });
  });
  describe('Remove Comment', () => {
    const id = '3ert34';
    it('should call remove comment', async () => {
      controller.remove(id);
      expect(spyService.remove).toHaveBeenCalled();
    });
    it('should remove comment', () => {
      expect(spyService.remove(id)).toEqual({ test: 'test' });
    });
  });
});
