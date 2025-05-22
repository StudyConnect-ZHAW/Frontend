import { Category, CategoryCreateData } from "@/types/forum";
import { parseResponse } from "./parseResponse";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}v1`;

function getRequestHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

export async function createCategory(data: CategoryCreateData): Promise<string> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    credentials: 'include',
    headers: getRequestHeaders(),
    body: JSON.stringify(data),
  });

  return parseResponse<string>(res);
}

export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'GET',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Category[]>(res);
}

export async function getCategoryById(categoryId: string): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: 'GET',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Category>(res);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<void>(res);
}