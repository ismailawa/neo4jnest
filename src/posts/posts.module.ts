import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostDao } from './dao/post-dao';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostDao],
})
export class PostsModule {}
