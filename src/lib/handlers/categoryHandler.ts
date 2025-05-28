import { Category, CategoryCreateData } from "@/types/category";
import { parseResponse } from "../api/parseResponse";

export async function createCategory(
  data: CategoryCreateData
): Promise<string> {
  const res = await fetch(`/api/categories`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });

  return parseResponse<string>(res);
}

export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`/api/categories`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Category[]>(res);
}

export async function getCategoryById(categoryId: string): Promise<Category> {
  const res = await fetch(`/api/categories/${categoryId}`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Category>(res);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const res = await fetch(`/api/categories/${categoryId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseResponse<void>(res);
}