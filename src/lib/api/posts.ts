import { Post, PostCreateData, PostUpdateData } from "@/types/forum";
import { parseResponse } from "./parseResponse";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}v1`;

function getRequestHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',   // Request body format
    'Accept': 'application/json',         // Response body format
  };
}

export async function createPost(data: PostCreateData): Promise<string> {
    const res = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
    });

    // Expects postId in response body
    return parseResponse<string>(res);
}

export async function getAllPosts(): Promise<Post[]> {
    const res = await fetch(`${BASE_URL}/posts`, {
        method: 'GET',
        credentials: 'include',
        headers: getRequestHeaders(),
    });

    return parseResponse<Post[]>(res);
}

export async function searchPosts(userId?: string, categoryName?: string, title?: string): Promise<Post[]> {
    const params = new URLSearchParams();

    if (userId) { params.append("userId", userId); }
    if (categoryName) { params.append("categoryName", categoryName); }
    if (title) { params.append("title", title); }

    const res = await fetch(`${BASE_URL}/posts/search?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: getRequestHeaders(),
    });

    return parseResponse<Post[]>(res);
}

export async function getPostById(postId: string): Promise<Post> {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: getRequestHeaders(),
    });

    return parseResponse<Post>(res);
}

export async function updatePostById(postId: string, data: PostUpdateData): Promise<Post> {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
    });

    return parseResponse<Post>(res);
}

export async function deletePostById(postId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getRequestHeaders(),
    });

    return parseResponse<void>(res);
}