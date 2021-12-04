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
    const query = `MATCH (p:${POST})  OPTIONAL MATCH (c:${COMMENT})-[r: BelongsTo]->(p) RETURN p,c  ORDER BY p.createdAt SKIP $skip LIMIT $limit`;
    const result = await this.neo4jService.read(query, {
      skip: neo4j.int(skip),
      limit: neo4j.int(limit),
    });

    const postObjId = Array.from(
      new Set(result.records.map((record) => record.get('p').properties.id)),
    );
    const postObj = result.records.map((record) => record.get('p').properties);
    const commentObj = result.records.map((record) => record.get('c'));

    const newObj = [];

    for (let i = 0; i < postObjId.length; i++) {
      const obj = { ...postObj[i], comments: [] };
      for (let j = 0; j < commentObj.length; j++) {
        // console.log(Array.from(new Set(postObj))[i]);

        if (postObjId[i] === { ...commentObj[j] }.properties?.postId) {
          obj.comments.push({ ...commentObj[j] }.properties);
          console.log({ ...commentObj[j] }.properties.postId);
        }
      }

      newObj.push(obj);
    }

    return newObj;
  }

  async getAllPostWithRelationship(): Promise<any> | null {
    return await this.neo4jService.read(`MATCH (p:${POST}) RETURN p`);
  }

  /**
   * get single post
   * @param id
   */
  async getAPost(id: string): Promise<any> | null {
    const result = await this.neo4jService.read(
      `MATCH (p:${POST} {id:$id}) OPTIONAL MATCH (c:${COMMENT})-[r: BelongsTo]->(p) RETURN p, c`,
      {
        id,
      },
    );
    return {
      ...result.records[0].get('p').properties,
      comment: result.records[0].get('c').properties,
    };
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
