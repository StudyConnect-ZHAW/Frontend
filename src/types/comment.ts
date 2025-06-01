import { User } from "./user";

export interface Comment {
  forumCommentId: string;
  content: string;
  created: string; // ISO 8601
  updated: string; // ISO 8601
  replyCount: number;
  likeCount: number;
  edited: boolean;
  deleted: boolean;
  postId: string;
  parentCommentId: string;
  user: User;
  replies?: Comment[];
}

/**
 * Payload to create a comment or reply.
 */
export interface CommentCreateData {
  parentCommentId: string | null;
  content: string;
}

/**
 * Payload to update an existing comment.
 */
export interface CommentUpdateData {
  content: string;
}