// Custom fetch function that handles SSL certificate errors in both Node.js and browser environments
export const customFetch = async (url: string, options: RequestInit = {}) => {
  const fetchOptions: RequestInit = {
    ...options,
  };

  // Only add the agent option in Node.js environment (not in the browser)
  if (typeof window === 'undefined') {
    // @ts-ignore - Node.js specific property
    fetchOptions.agent = {
      rejectUnauthorized: false
    };
  }

  try {
    return await fetch(url, fetchOptions);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}; 