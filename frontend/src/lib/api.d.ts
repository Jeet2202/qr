declare const api: {
  get: (path: string) => Promise<unknown>;
  post: (path: string, body?: unknown) => Promise<Record<string, unknown>>;
  put: (path: string, body?: unknown) => Promise<unknown>;
  delete: (path: string) => Promise<unknown>;
};

export default api;
