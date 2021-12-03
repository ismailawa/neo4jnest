import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { COMMENT, POST } from 'src/shared/constants';
import { QueryResult } from 'neo4j-driver';
import { classToPlain } from 'class-transformer';
import neo4j from 'neo4j-driver';
import { nanoid } from 'nanoid';

@Injectable()
export class PostDao {
  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * create post
   * @param postDto
   */
  async createPost(createPostDto: CreatePostDto): Promise<QueryResult> | null {
    const payload = {
      id: nanoid(8),
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createPostDto,
    };
    const query = `CREATE (p:${POST} $payload) RETURN p`;
    return await this.neo4jService.write(query, {
      payload,
    });
  }

  /**
   * get all post
   * @param id
   */
  async getAllPost(skip: number, limit: number): Promise<any> | null {
    const query = `MATCH (p:${POST})  OPTIONAL MATCH (p)<-[r: BelongsTo]-(c:${COMMENT}) WITH COLLECT({id: p.id,title: p.title, content: p.content, comment: c }) AS pcommects RETURN pcommects SKIP $skip LIMIT $limit`;
    const result = await this.neo4jService.read(query, {
      skip: neo4j.int(skip),
      limit: neo4j.int(limit),
    });

    const obj = result.records[0]['_fields'][0];

    return obj
      .map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
      }))
      .map((post) => ({
        ...post,
        comments: obj
          .filter((comment) => comment.id === post.id)
          .map((comment) => ({ ...comment.comment })),
      }));
  }

  async getAllPostWithRelationship(): Promise<any> | null {
    return await this.neo4jService.read(`MATCH (p:${POST}) RETURN p`);
  }

  /**
   * get single post
   * @param id
   */
  async getAPost(id: string): Promise<any> | null {
    return await this.neo4jService.read(`MATCH (p:${POST} {id:$id}) RETURN p`, {
      id,
    });
  }

  /**
   * update post
   * @param id
   * @param updatePostDto
   */
  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<any> | null {
    const object = classToPlain(updatePostDto);
    return await this.neo4jService.write(
      `MATCH (p:${POST} {id: $id})  SET p +=$updateValue RETURN p`,
      { id, updateValues: object },
    );
  }

  /**
   * delete post
   * @param id
   */
  async deletePost(id: string): Promise<any> | null {
    return await this.neo4jService.write(
      `MATCH (p:${POST} {id:'${id}'})  DETACH DELETE p RETURN p`,
    );
  }
}
