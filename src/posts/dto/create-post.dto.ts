export class CreatePostDto {
  title: string;
  content: string;
  isActive?: boolean = true;
}
