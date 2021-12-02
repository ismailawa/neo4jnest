import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { classToPlain } from 'class-transformer';
import { POST } from 'src/shared/constants';
import { QueryResult } from 'neo4j-driver';

@Injectable()
export class PostDao {
  constructor(private readonly neo4jService: Neo4jService) {}
  /**
   * create post
   * @param postDto
   */
  async createPost(createPostDto: CreatePostDto): Promise<QueryResult> | null {
    return await this.neo4jService.write(
      `CREATE (p:${POST} {title: "${createPostDto.title}", content: "${createPostDto.content}", status: "${createPostDto.status}"}) RETURN p`,
    );
  }
  /**
   * get all post
   * @param id
   */
  async getAllPost(): Promise<any> | null {
    return this.neo4jService.read(`MATCH (p:${POST}) RETURN p`);
  }

  async getAllPostWithRelationship(): Promise<any> | null {
    return this.neo4jService.read(`MATCH (p:${POST}) RETURN p`);
  }

  /**
   * get single post
   * @param id
   */
  async getAPost(id: number): Promise<any> | null {
    return this.neo4jService.read(
      `MATCH (p:${POST}) WHERE ID(p)=${id} RETURN p`,
    );
  }

  /**
   * update post
   * @param id
   * @param updatePostDto
   */
  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<any> | null {
    const object = classToPlain(updatePostDto);
    console.log(object);
    return this.neo4jService.read(
      `MATCH (p:${POST}) WHERE ID(p)=${id} SET p +=${object} RETURN p`,
    );
  }
  /**
   * delete post
   * @param id
   */
  async deletePost(id: number): Promise<any> | null {
    return this.neo4jService.read(
      `MATCH (p:${POST}) WHERE ID(p)=${id} DELETE p RETURN p`,
    );
  }
}
