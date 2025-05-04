// Custom fetch function that ignores SSL certificate errors
export const customFetch = async (url: string, options: RequestInit = {}) => {
  // Add rejectUnauthorized: false to the agent options
  const fetchOptions: RequestInit = {
    ...options,
    // @ts-ignore - Node.js specific property
    agent: {
      rejectUnauthorized: false
    }
  };

  return fetch(url, fetchOptions);
}; 