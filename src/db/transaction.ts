import type { db } from "./db";

export const transaction = async <T>(client: typeof db, fn: (txClient: typeof db) => Promise<T>): Promise<T> => {
  return client.transaction(async tx => {
    try {
      return await fn(tx as unknown as typeof db);
    } catch (e) {
      console.error(e);
      try {
        tx.rollback();
      } catch (e) {
        console.error(e);
      }

  
      throw new Error('Unknown error');
    }
  });
};
