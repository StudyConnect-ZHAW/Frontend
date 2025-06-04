import { getAllCategories } from "@/lib/handlers/categoryHandler";
import { Category } from "@/types/category";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch all forum categories.
 * 
 * Returns:
 *  • list of categories
 *  • loading state
 *  • error state if fetching fails
 */
export function useForumCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}