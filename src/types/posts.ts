import { Category } from "@/types/category";
import { User } from "@/types/user";

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  likeCount: number;
  category: Category;
  author: User;
}

/**
 * Payload to create a new post.
 */
export interface PostCreateData {
  title: string;
  content: string;
  forumCategoryId: string;
}

/**
 * Payload to update an existing post.
 */
export interface PostUpdateData {
  title?: string;
  content?: string;
}
