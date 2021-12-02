import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentDao } from './doa/comment-doa';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentDao],
})
export class CommentsModule {}
