/**
 * Represents a forum category. 
 */
export interface Category {
  forumCategoryId: string;
  name: string;
  description: string;
}

/**
 * Payload to create a new category.
 */
export interface CategoryCreateData {
  name: string;
  description?: string;
}