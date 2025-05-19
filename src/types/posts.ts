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
