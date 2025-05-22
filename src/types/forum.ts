export interface Author {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Category {
  forumCategoryId: string;
  name: string;
  description: string;
}

export interface Comment {
  id: string;
  author: Author;
  createdAt: string;
  content: string;
  likes: number;
  children?: Comment[];
}

export interface ForumPostData {
  forumPostId: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
  commentsCount: number;
  shares: number;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  forumCategoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DetailedPost {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  tags: string[];
  likes: number;
  shares: number;
  comments?: Comment[];
}

export interface CategoryCreateData {
  name: string;
  description: string;
}

export interface PostCreateData {
  userId: string;
  title: string;
  forumCategoryId: string;
  content: string;
}

export interface PostUpdateData {
  title?: string;
  content?: string;
  forumCategoryId?: string;
}

export interface CommentCreateData {
  userId: string;
  parentCommentId: string;
  content: string;
}

export interface CommentUpdateData {
  userId: string;
  content: string;
}
