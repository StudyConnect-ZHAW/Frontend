import { User } from "./user";

export interface Comment {
  id: string;
  author: User;
  createdAt: string; // ISO 8601
  content: string;
  likes: number;
  children?: Comment[];
}

/**
 * Payload to create a comment or reply.
 */
export interface CommentCreateData {
  parentCommentId: string;
  content: string;
}

/**
 * Payload to update an existing comment.
 */
export interface CommentUpdateData {
  content: string;
}