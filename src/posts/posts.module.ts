import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostDao } from './doa/post-doa';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Neo4jModule } from 'src/neo4j/neo4j.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostDao],
})
export class PostsModule {}
