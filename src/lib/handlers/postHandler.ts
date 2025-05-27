import { Post, PostCreateData, PostUpdateData } from "@/types/posts";
import { parseResponse } from "../api/parseResponse";

export async function createPost(data: PostCreateData): Promise<Post> {
  const res = await fetch(`/api/posts`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });

  // Expects postId in response body
  return parseResponse<Post>(res);
}

export async function getAllPosts(): Promise<Post[]> {
  const res = await fetch(`/api/posts`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Post[]>(res);
}

export async function searchPosts(
  userId?: string,
  categoryName?: string,
  title?: string
): Promise<Post[]> {
  const params = new URLSearchParams();

  if (userId) {
    params.append("userId", userId);
  }
  if (categoryName) {
    params.append("categoryName", categoryName);
  }
  if (title) {
    params.append("title", title);
  }

  const res = await fetch(`/api/posts/search?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Post[]>(res);
}

export async function getPostById(postId: string): Promise<Post> {
  const res = await fetch(`/api/posts/${postId}`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Post>(res);
}

export async function updatePostById(
  postId: string,
  data: PostUpdateData
): Promise<Post> {
  const res = await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(data),
  });

  return parseResponse<Post>(res);
}

export async function deletePostById(postId: string): Promise<void> {
  const res = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseResponse<void>(res);
}
