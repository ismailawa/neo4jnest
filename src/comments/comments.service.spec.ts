import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentDao } from './dao/comment-dao';

describe('CommentsService', () => {
  let service: CommentsService;
  let spyCommentDao: CommentDao;

  beforeEach(async () => {
    const CommentsServiceProvider = {
      provide: CommentsService,
      useFactory: () => ({
        create: jest.fn(() => ({ test: 'test' })),
      }),
    };

    const CommentDaoProvider = {
      provide: CommentDao,
      useFactory: () => ({
        createComment: jest.fn((payload) => ({ test: 'test' })),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        CommentsServiceProvider,
        CommentDao,
        CommentDaoProvider,
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    spyCommentDao = module.get<CommentDao>(CommentDao);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Should call on Comment DAO', () => {
    const response = {
      code: 200,
      meta: {
        totalItems: expect.any(Number),
        itemsPerPage: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
      },
      links: {
        first: expect.any(String),
        next: expect.any(String),
        last: expect.any(String),
      },
      data: [
        {
          createdAt: expect.any,
          id: expect.any(String),
          isActive: expect.any(Boolean),
          title: expect.any(String),
          content: expect.any(String),
          updatedAt: expect.any,
          comment: expect.any(Array),
        },
      ],
    };

    test('createComment', async () => {
      const payload = {
        postId: '4242442',
        content: 'test content',
        isActive: true,
      };
      service.create(payload);
      expect(spyCommentDao.createComment).toHaveBeenCalledWith(payload);
    });
  });
});
