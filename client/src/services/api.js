let cachedCsrfToken = null;

export const fetchApi = async (endpoint, options = {}) => {
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase());

  if (isMutation && !cachedCsrfToken) {
    const csrfRes = await fetch('/api/admin/csrf', { credentials: 'same-origin' });
    if (!csrfRes.ok) {
      if (csrfRes.status === 429) {
        const retryAfter = csrfRes.headers.get('Retry-After');
        throw new Error(`Too many requests. Please try again in ${retryAfter || 'a few'} seconds.`);
      }
      throw new Error('Failed to fetch CSRF token');
    }
    const csrfData = await csrfRes.json();
    cachedCsrfToken = csrfData.csrfToken;
  }

  const headers = {
    ...(options.headers || {})
  };

  if (isMutation && cachedCsrfToken) {
    headers['X-CSRF-Token'] = cachedCsrfToken;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(endpoint, {
    ...options,
    credentials: 'same-origin',
    headers,
  });

  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After');
    throw new Error(`Too many requests. Please try again in ${retryAfter || 'a few'} seconds.`);
  }

  if (res.status === 401) {
    // Redirect to login only if we are not already on the login page or checking auth status
    if (window.location.pathname !== '/admin/login' && endpoint !== '/api/admin/auth/me') {
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }

  if (res.status === 403) {
    throw new Error('Permission denied.');
  }

  if (res.status === 409) {
    throw new Error('Conflict: The document has been modified by another user.');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'An error occurred.');
  }
  return data;
};
