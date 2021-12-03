import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { classToPlain } from 'class-transformer';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { nanoid } from 'nanoid';
import { COMMENT } from 'src/shared/constants';

@Injectable()
export class CommentDao {
  constructor(private readonly neo4jService: Neo4jService) {}
  /**
   * Adding comments
   * @param createCommentDto
   */
  async createComment(createCommentDto: CreateCommentDto): Promise<any> | null {
    const comment = { id: nanoid(8), ...createCommentDto };
    const query = `MATCH (p:${COMMENT} {id: $postId})  CREATE (p) <- [r: BelongsTo] - (c:Comment $createComment), (p)-[s: HasMany]->(c)  RETURN c`;

    return this.neo4jService.write(query, {
      postId: createCommentDto.postId,
      createComment: comment,
    });
  }
  async getAllComments(): Promise<any> | null {
    const query = `MATCH (c:${COMMENT})-[r: BelongsTo]->(p) RETURN c, p`;
    return this.neo4jService.read(query);
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
