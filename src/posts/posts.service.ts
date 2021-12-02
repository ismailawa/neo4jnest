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

  findAll() {
    return this.postDao.getAllPost();
  }

  findOne(id: number) {
    return this.postDao.getAPost(id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postDao.updatePost(id, updatePostDto);
  }

  remove(id: number) {
    return this.postDao.deletePost(id);
  }
}
