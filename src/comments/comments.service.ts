import { Injectable } from '@nestjs/common';
import { CommentDao } from './dao/comment-dao';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentDao: CommentDao) {}
  create(createCommentDto: CreateCommentDto) {
    return this.commentDao.createComment(createCommentDto);
  }

  findAll() {
    return this.commentDao.getAllComments();
  }

  findOne(id: string) {
    return this.commentDao.getComment(id);
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.commentDao.updateComment(id, updateCommentDto);
  }

  remove(id: string) {
    return this.commentDao.deleteComment(id);
  }
}
