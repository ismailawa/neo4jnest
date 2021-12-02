import { Injectable } from '@nestjs/common';
import { CommentDao } from './doa/comment-doa';
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

  findOne(id: number) {
    return this.commentDao.getComment(id);
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentDao.updateComment(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentDao.deleteComment(id);
  }
}
