export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  forumCategoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateData {
  userId: string;
  title: string;
  content: string;
  forumCategoryId: string;
}

export interface PostUpdateData {
  title?: string;
  content?: string;
  forumCategoryId?: string;
}
