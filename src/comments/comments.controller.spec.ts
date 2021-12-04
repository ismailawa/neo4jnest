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
});
