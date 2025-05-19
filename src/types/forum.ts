export interface Author {
  firstName: string;
  lastName: string;
  email: string;
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

export interface DetailedPost {
  id: string; // oder forumPostId, je nach API
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  tags: string[];
  likes: number;
  shares: number;
  comments?: Comment[];
}
