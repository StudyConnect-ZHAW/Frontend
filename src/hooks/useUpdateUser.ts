import { useState } from "react";
import type { User, UserUpdateData } from "@/types/user";
import { updateUser } from "@/lib/handlers/userHandler";
import { useCurrentUser } from "./useCurrentUser";

/**
 * React-Hook, um das Profil des aktuell angemeldeten Users zu aktualisieren.
 *
 * ```ts
 * const { update, loading, error } = useUpdateUser();
 *
 * await update({ firstName: "Ada", lastName: "Lovelace" });
 * ```
 */
export function useUpdateUser() {
  const { user: currentUser } = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<Error | null>(null);

  /**
   * Führt den PUT-Call aus. `partialData` kann nur die Felder enthalten,
   * die tatsächlich geändert werden sollen.
   */
  const update = async (partialData: UserUpdateData): Promise<void> => {
    if (!currentUser) {
      throw new Error("No authenticated user – cannot update profile");
    }

    // Mit vorhandenen Werten mergen, da das Backend laut Typ vollständige Daten erwartet
    const payload: User = {
      firstName: partialData.firstName ?? currentUser.firstName,
      lastName:  partialData.lastName  ?? currentUser.lastName,
      email:     partialData.email     ?? currentUser.email,
    };

    setLoading(true);
    setError(null);

    try {
      await updateUser(payload);      // Aufruf des Route-Handlers
    } catch (err) {
      setError(err as Error);
      throw err;                      // Weiterreichen an Aufrufer
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
