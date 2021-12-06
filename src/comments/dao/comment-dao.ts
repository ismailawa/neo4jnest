import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';
import { classToPlain } from 'class-transformer';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { nanoid } from 'nanoid';
import { COMMENT, POST } from '../../shared/constants';

@Injectable()
export class CommentDao {
  constructor(private readonly neo4jService: Neo4jService) {}
  /**
   * Adding comments
   * @param createCommentDto
   */
  async createComment(createCommentDto: CreateCommentDto): Promise<any> | null {
    const query = `MATCH (p:${POST} {id: $postId})  CREATE (p) <- [r: BelongsTo] - (c:Comment {id: randomUUID(),content:$content, isActive:$isActive, createdAt: $createdAt, updatedAt: $updatedAt}), (p)-[s: HasMany]->(c)  RETURN c`;

    const result = await this.neo4jService.write(query, {
      postId: createCommentDto.postId,
      content: createCommentDto.content,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { data: result.records[0].get['c'] };
  }
  async getAllComments(): Promise<any> | null {
    const query = `MATCH (c:${COMMENT}) RETURN c`;
    const result = await this.neo4jService.read(query);
    return {
      data: result.records.map((record: any) => record),
    };
  }
  async getComment(id: string): Promise<any> | null {
    return this.neo4jService.read(`MATCH (c:${COMMENT} {id: $id})  RETURN c`, {
      id,
    });
  }
  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<any> | null {
    const object = classToPlain(updateCommentDto);
    console.log(object);
    const query = `MATCH (c:${COMMENT} {id: $id}) SET c +=$updateValues RETURN c`;
    return this.neo4jService.write(query, { id, updateValues: object });
  }

  async deleteComment(id: string): Promise<any> | null {
    const query = `MATCH (c:${COMMENT}{id: $id}) DETACH DELETE c RETURN c`;
    return this.neo4jService.write(query, { id });
  }
}
