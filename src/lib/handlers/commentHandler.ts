import { Comment, CommentCreateData, CommentUpdateData } from "@/types/comment";
import { parseResponse } from "@/lib/api/parseResponse";

export async function createComment(postId: string, data: CommentCreateData): Promise<string> {
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
  });

  return parseResponse<string>(res);
}

export async function getCommentsForPost(postId: string): Promise<Comment[]> {
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: 'GET',
    credentials: 'include',
  });

  return parseResponse<Comment[]>(res);
}

export async function getCommentById(commentId: string): Promise<Comment> {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: 'GET',
    credentials: 'include',
  });

  return parseResponse<Comment>(res);
}

export async function updateComment(commentId: string, data: CommentUpdateData): Promise<Comment> {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(data),
  });

  return parseResponse<Comment>(res);
}

export async function deleteComment(commentId: string): Promise<void> {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  return parseResponse<void>(res);
}

/**
 * Adds or removes a like by the current user on a comment.
 * 
 * @param commentId The ID of the comment.
 * @returns 
 */
export async function toggleCommentLike(commentId: string): Promise<void> {
  const res = await fetch(`/api/comments/${commentId}/likes`, {
    method: 'PUT',
    credentials: 'include',
  });

  return parseResponse<void>(res);
}

/**
 * Fetches the comments that the current user has liked.
 * 
 * @returns A list of comment IDs which the current user has liked.
 */
export async function getLikedCommentIds(): Promise<string[]> {
  const res = await fetch('/api/comments/likes', {
    method: 'GET',
    credentials: 'include',
  });

  console.log(res); // TODO: Remove

  const likes = await parseResponse<
    {
      likeId: string;
      userId: string;
      forumCommentId: string;
      likedAt: string;
    }[]
  >(res);

  return likes.map((like) => like.forumCommentId);
}