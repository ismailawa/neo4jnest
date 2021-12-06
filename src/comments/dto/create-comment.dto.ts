export class CreateCommentDto {
  postId: string;
  content: string;
  isActive?: boolean;
}
