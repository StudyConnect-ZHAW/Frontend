import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, updateUser }      from '@/lib/handlers/userHandler';
import type { User, UserUpdateData }       from '@/types/user';

/**
 * Returns the authenticated user **and** exposes a helper for partial updates.
 *
 * ```ts
 * const { user, loading, update, updating, error } = useCurrentUser();
 * await update({ firstName: 'Ada', email: 'ada@lovelace.dev' });
 * ```
 */
export function useCurrentUser() {
  /* ------------------------------------------------------------------ */
  /*  Fetch user once on mount                                          */
  /* ------------------------------------------------------------------ */
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Update logic                                                      */
  /* ------------------------------------------------------------------ */
  const [updating, setUpdating] = useState(false);
  const [error,    setError]    = useState<Error | null>(null);

  /**
   * Sends only the changed fields (`UserUpdateData`) to the backend and
   * merges the response locally so the UI stays in sync.
   */
  const update = useCallback(
    async (changes: UserUpdateData): Promise<void> => {
      if (!user) {
        throw new Error('No authenticated user – cannot update profile');
      }

      setUpdating(true);
      setError(null);

      try {
        await updateUser(changes);                       // network call
        setUser(prev => (prev ? { ...prev, ...changes } // local merge
                              : prev));
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [user],
  );

  /* ------------------------------------------------------------------ */
  return { user, loading, update, updating, error };
}