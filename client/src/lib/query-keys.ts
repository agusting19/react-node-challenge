/* eslint-disable @typescript-eslint/no-explicit-any */
export const QUERY_KEYS = {
  trips: {
    all: ["trips"] as const,
    lists: () => [...QUERY_KEYS.trips.all, "list"] as const,
    list: (params: Record<string, any>) =>
      [...QUERY_KEYS.trips.lists(), params] as const,
    details: () => [...QUERY_KEYS.trips.all, "detail"] as const,
    detail: (id: string) => [...QUERY_KEYS.trips.details(), id] as const,
  },
  auth: {
    user: ["auth", "user"] as const,
  },
} as const;
