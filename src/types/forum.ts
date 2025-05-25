import { User } from "@/types/user";

/**
 * Represents a forum category. */
export interface Category {
  forumCategoryId: string;
  name: string;
  description: string;
}

/**
 * TODO in forum PR
 */
export interface Comment {
  id: string;
  author: User;
  createdAt: string; // ISO 8601
  content: string;
  likes: number;
  children?: Comment[];
}

/**
 * TODO in forum PR
 */
export interface ForumPostData {
  forumPostId: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  commentsCount: number;
  shares: number;
}

/**
 * TODO in forum PR
 */
export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  forumCategoryId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * TODO in forum PR
 */
export interface DetailedPost {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  tags: string[];
  likes: number;
  shares: number;
  comments?: Comment[];
}

/**
 * Payload to create a new category.
 */
export interface CategoryCreateData {
  name: string;
  description: string;
}

/**
 * Payload to create a new post.
 */
export interface PostCreateData {
  userId: string;
  title: string;
  forumCategoryId: string;
  content: string;
}

/**
 * Payload to update an existing post.
 */
export interface PostUpdateData {
  title?: string;
  content?: string;
  forumCategoryId?: string;
}

/**
 * Payload to create a comment or reply.
 */
export interface CommentCreateData {
  userId: string;
  parentCommentId: string;
  content: string;
}

/**
 * Payload to update an existing comment.
 */
export interface CommentUpdateData {
  userId: string;
  content: string;
}