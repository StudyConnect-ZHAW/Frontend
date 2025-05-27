import { Category } from "@/types/category";
import { User } from "@/types/user";

/**
 * Represents an individual post in the forum page.
 */
export interface Post {
  forumPostId: string;
  title: string;
  content: string;
  commentCount: number;
  likeCount: number;
  created: string;
  updated: string;
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
  title: string;
  content: string;
}
