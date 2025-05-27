import { Comment, CommentCreateData, CommentUpdateData } from "@/types/comment";
import { parseResponse } from "../api/parseResponse";

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