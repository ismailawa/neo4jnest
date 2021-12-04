import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { COMMENT, POST } from '../../shared/constants';
import { classToPlain } from 'class-transformer';
import neo4j from 'neo4j-driver';
import { nanoid } from 'nanoid';
import { paginate } from '../../shared/helpers';
import { ServerException } from '../../shared/base-exception';

@Injectable()
export class PostDao {
  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * create post
   * @param postDto
   */
  async createPost(createPostDto: CreatePostDto): Promise<any> | null {
    const payload = {
      id: nanoid(8),
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createPostDto,
    };
    try {
      const query = `CREATE (p:${POST} $payload) RETURN p`;
      const result = await this.neo4jService.write(query, {
        payload,
      });
      return { data: result.records[0].get('p').properties };
    } catch (error) {
      throw new ServerException(
        error.message,
        'Error occurd in create user dto',
      );
    }
  }

  /**
   * get all post
   * @param id
   */
  async getAllPost(
    skip: number,
    limit: number,
    page: number,
  ): Promise<any> | null {
    try {
      const query = `MATCH (p:${POST}) OPTIONAL MATCH (c:${COMMENT})-[r: BelongsTo]->(p) RETURN p,c  ORDER BY p.createdAt DESC SKIP $skip LIMIT $limit`;
      const queryCount = `MATCH (p:${POST}) RETURN count(p) as count`;
      const resultCount = await this.neo4jService.read(queryCount);
      const result = await this.neo4jService.read(query, {
        skip: neo4j.int(skip),
        limit: neo4j.int(limit),
      });

      const postObjId = Array.from(
        new Set(result.records.map((record) => record.get('p').properties.id)),
      );
      const postObj = result.records.map(
        (record) => record.get('p').properties,
      );
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
      console.log(result.records);
      const paginations = paginate(
        resultCount.records[0].get('count').low,
        page,
        limit,
      );
      console.log(paginations);
      return {
        data: newObj,
        meta: {
          totalItems: paginations.totalItems,
          itemsPerPage: limit,
          totalPages: paginations.totalPages,
          currentPage: paginations.currentPage,
        },
        links: {
          first: `http://localhost:3000/posts?page=${
            paginations.pages[paginations.startIndex]
          }`,
          next:
            paginations.pages[paginations.currentPage + 1] === undefined
              ? ''
              : `http://localhost:3000/posts?page=${
                  paginations.pages[paginations.currentPage + 1]
                }`,
          last: `http://localhost:3000/posts?page=${
            paginations.pages[paginations.pages.length - 1]
          }`,
        },
      };
    } catch (error) {
      throw new ServerException(
        error.message,
        'Error occurd in get all post dao',
      );
    }
  }

  async getAllPostWithRelationship(): Promise<any> | null {
    return await this.neo4jService.read(`MATCH (p:${POST}) RETURN p`);
  }

  /**
   * get single post
   * @param id
   */
  async getAPost(id: string): Promise<any> | null {
    try {
      const result = await this.neo4jService.read(
        `MATCH (p:${POST} {id:$id}) OPTIONAL MATCH (c:${COMMENT})-[r: BelongsTo]->(p) RETURN p, c`,
        {
          id,
        },
      );
      return {
        data: {
          ...result.records[0].get('p').properties,
          comment: result.records[0].get('c').properties,
        },
      };
    } catch (error) {
      throw new ServerException(error.message, 'Error occurd in get post dao');
    }
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
    try {
      const object = classToPlain(updatePostDto);
      const result = await this.neo4jService.write(
        `MATCH (p:${POST} {id: $id})  SET p +=$updateValue RETURN p`,
        { id, updateValues: object },
      );

      return { data: result.records[0].get('p').properties };
    } catch (error) {
      throw new ServerException(
        error.message,
        'Error occurd in update post dao',
      );
    }
  }

  /**
   * delete post
   * @param id
   */
  async deletePost(id: string): Promise<any> | null {
    try {
      const result = await this.neo4jService.write(
        `MATCH (p:${POST} {id:'${id}'})  DETACH DELETE p RETURN p`,
      );
      return { data: result.records[0].get('p').properties };
    } catch (error) {
      throw new ServerException(
        error.message,
        'Error occurd in delete post dao',
      );
    }
  }
}
