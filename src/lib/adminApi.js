import { apiRequest } from './api';

export async function getClients({ token, id } = {}) {
  const query = new URLSearchParams();
  if (id) query.set('id', String(id));
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/api/client/get${suffix}`, { token });
}

export async function createClient(body, token) {
  return apiRequest('/api/client/create', { method: 'POST', body, token });
}

export async function updateClient(id, body, token) {
  return apiRequest(`/api/client/update/${id}`, { method: 'PUT', body, token });
}

export async function deleteClient(id, token) {
  return apiRequest(`/api/client/delete/${id}`, { method: 'DELETE', token });
}

export async function getClientPayments(token) {
  return apiRequest('/api/clientPayment/all', { token });
}

export async function getClientPaymentById(id, token) {
  return apiRequest(`/api/clientPayment/${id}?id=${id}`, { token });
}

export async function createClientPayment(body, token) {
  return apiRequest('/api/clientPayment/create', { method: 'POST', body, token });
}

export async function updateClientPayment(id, body, token) {
  return apiRequest(`/api/clientPayment/update/${id}`, { method: 'PUT', body, token });
}

export async function deleteClientPayment(id, token) {
  return apiRequest(`/api/clientPayment/delete/${id}`, { method: 'DELETE', token });
}
