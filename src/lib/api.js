const API_BASE = 'https://sass-gym-backend.vercel.app';

function buildHeaders(token, hasJsonBody) {
  const headers = {};
  if (hasJsonBody) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const hasJsonBody = body !== undefined && !isFormData;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders(token, hasJsonBody),
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export { API_BASE };
