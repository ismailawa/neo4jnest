import { Injectable } from '@nestjs/common';
import { PostDao } from './dao/post-dao';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postDao: PostDao) {}
  create(createPostDto: CreatePostDto) {
    return this.postDao.createPost(createPostDto);
  }

  findAll(skip: number, limit: number, page: number) {
    return this.postDao.getAllPost(skip, limit, page);
  }

  findOne(id: string) {
    return this.postDao.getAPost(id);
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postDao.updatePost(id, updatePostDto);
  }

  remove(id: string) {
    return this.postDao.deletePost(id);
  }
}
