import { apiRequest } from './api';

function appendIfPresent(formData, key, value) {
  if (value === undefined || value === null || value === '') return;
  formData.append(key, value);
}

function buildGymOwnerFormData(payload = {}) {
  const fd = new FormData();
  appendIfPresent(fd, 'company_name', payload.company_name);
  appendIfPresent(fd, 'company_url', payload.company_url);
  appendIfPresent(fd, 'company_address', payload.company_address);
  appendIfPresent(fd, 'company_phone_number', payload.company_phone_number);
  appendIfPresent(fd, 'company_phone_number_two', payload.company_phone_number_two);
  appendIfPresent(fd, 'company_package_start_at', payload.company_package_start_at);
  appendIfPresent(fd, 'company_package_end_at', payload.company_package_end_at);
  appendIfPresent(fd, 'name', payload.name);
  appendIfPresent(fd, 'email', payload.email);
  appendIfPresent(fd, 'password', payload.password);

  if (payload.logo instanceof File) {
    fd.append('logo', payload.logo);
  }
  return fd;
}

export async function getGymOwners({ token, id, page, limit } = {}) {
  const query = new URLSearchParams();
  if (id) query.set('id', String(id));
  if (page) query.set('page', String(page));
  if (limit) query.set('limit', String(limit));
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/api/superAdmin/getUser${suffix}`, { token });
}

export async function createGymOwner(payload, token) {
  return apiRequest('/api/superAdmin/createUser', {
    method: 'POST',
    body: buildGymOwnerFormData(payload),
    token,
  });
}

export async function updateGymOwner({ id, companyId, payload, token }) {
  return apiRequest(`/api/superAdmin/updateUser/${id}/${companyId}`, {
    method: 'PUT',
    body: buildGymOwnerFormData(payload),
    token,
  });
}

export async function deleteGymOwner(id, token) {
  return apiRequest(`/api/superAdmin/deleteUser/${id}`, {
    method: 'DELETE',
    token,
  });
}
