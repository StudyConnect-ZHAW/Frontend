import { Comment, CommentCreateData, CommentUpdateData } from "@/types/forum";
import { parseResponse } from "./parseResponse";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}v1`;

function getRequestHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

export async function createComment(postId: string, data: CommentCreateData): Promise<string> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    credentials: 'include',
    headers: getRequestHeaders(),
    body: JSON.stringify(data),
  });

  return parseResponse<string>(res);
}

export async function getCommentsForPost(postId: string): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: 'GET',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Comment[]>(res);
}

export async function getCommentById(commentId: string): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'GET',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Comment>(res);
}

export async function updateComment(commentId: string, data: CommentUpdateData): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: getRequestHeaders(),
    body: JSON.stringify(data),
  });

  return parseResponse<Comment>(res);
}

export async function deleteComment(commentId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<void>(res);
}