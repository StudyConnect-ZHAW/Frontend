import { useState, useEffect, useCallback } from "react";
import { getCurrentUser, updateUser } from "@/lib/handlers/userHandler";
import type { User, UserUpdateData } from "@/types/user";

/**
 * Liefert das aktuell eingeloggte Profil + Update-Methode.
 *
 * ```ts
 * const { user, loading, update, updating, error } = useCurrentUser();
 *
 * await update({ firstName: "Ada" });
 * ```
 */
export function useCurrentUser() {
  /* --- Laden des Users --------------------------------------------------- */
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /* --- Updaten des Users -------------------------------------------------- */
  const [updating, setUpdating] = useState(false);
  const [error,    setError]    = useState<Error | null>(null);

  /**
   * merged state-safe Update-Funktion
   */
  const update = useCallback(
    async (changes: UserUpdateData): Promise<void> => {
      if (!user) throw new Error("No authenticated user – cannot update profile");

      setUpdating(true);
      setError(null);

      try {
        await updateUser(changes);                         // nur die Diff senden
        setUser(prev => (prev ? { ...prev, ...changes } : prev)); // lokal mergen
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [user],
  );

  return { user, loading, update, updating, error };
}
