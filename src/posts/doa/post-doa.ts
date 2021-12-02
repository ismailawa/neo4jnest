import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { classToPlain } from 'class-transformer';

@Injectable()
export class PostDao {
  constructor(private readonly neo4jService: Neo4jService) {}
  /**
   * Adding users
   * @param postDto
   */
  async createPost(createPostDto: CreatePostDto): Promise<any> | null {
    return this.neo4jService.write(
      `CREATE (p:Post {title: "${createPostDto.title}", content: "${createPostDto.content}", status: "${createPostDto.status}"}) RETURN p`,
    );
  }
  async getAllPost(): Promise<any> | null {
    return this.neo4jService.read(`MATCH (p:Post) RETURN p`);
  }
  async getAPost(id: number): Promise<any> | null {
    return this.neo4jService.read(`MATCH (p:Post) WHERE ID(p)=${id} RETURN p`);
  }
  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<any> | null {
    const object = classToPlain(updatePostDto);
    console.log(object);
    return this.neo4jService.read(
      `MATCH (p:Post) WHERE ID(p)=${id} SET p +=${object} RETURN p`,
    );
  }

  async deletePost(id: number): Promise<any> | null {
    return this.neo4jService.read(
      `MATCH (p:Post) WHERE ID(p)=${id} DELETE p RETURN p`,
    );
  }
}
