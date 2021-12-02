import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { classToPlain } from 'class-transformer';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentDao {
  constructor(private readonly neo4jService: Neo4jService) {}
  /**
   * Adding comments
   * @param createCommentDto
   */
  async createComment(createCommentDto: CreateCommentDto): Promise<any> | null {
    return this.neo4jService.write(
      `MATCH (p:Post) WHERE ID(p)=${createCommentDto.postId} CREATE (p) <- [r: BelongsTo] - (c:Comment {content: '${createCommentDto.content}', status: '${createCommentDto.status}', postId: '${createCommentDto.postId}'}) RETURN c`,
    );
  }
  async getAllComments(): Promise<any> | null {
    return this.neo4jService.read(`MATCH (c:Comment) RETURN c`);
  }
  async getComment(id: number): Promise<any> | null {
    return this.neo4jService.read(
      `MATCH (c:Comment) WHERE ID(p)=${id} RETURN c`,
    );
  }
  async updateComment(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<any> | null {
    const object = classToPlain(updateCommentDto);
    console.log(object);
    return this.neo4jService.write(
      `MATCH (c:Comment) WHERE ID(c)=${id} SET c +=${object} RETURN p`,
    );
  }

  async deleteComment(id: number): Promise<any> | null {
    return this.neo4jService.read(
      `MATCH (c:Comment) WHERE ID(c)=${id} DELETE c RETURN p`,
    );
  }
}
