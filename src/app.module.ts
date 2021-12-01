import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from './neo4j/neo4j.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule.forRoot({
      schema: 'neo4j+s',
      host: '8e5ae70a.databases.neo4j.io',
      port: '7687',
      username: 'neo4j',
      password: 'oFH_44iUUaL8Oir9aVbHswLlybE0_ZRqI2MxjUJOW8o',
    }),
    CommentsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
