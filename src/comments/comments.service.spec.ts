import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from '../neo4j/neo4j.service';
import { CommentsService } from './comments.service';
import { CommentDao } from './dao/comment-dao';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [CommentsService, CommentDao],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
