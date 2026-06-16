import { apiRequest } from './api';

function toClientFormData(body = {}) {
  const formData = new FormData();
  const fields = ['name', 'address', 'phone_number', 'age', 'sex', 'status'];
  fields.forEach((key) => {
    const value = body[key];
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  if (body.photo instanceof File) {
    formData.append('photo', body.photo);
    formData.append('file-photo', body.photo);
  }
  return formData;
}

function toQrClientFormData(body = {}) {
  const formData = new FormData();
  const fields = ['name', 'address', 'phone_number', 'age', 'sex'];
  fields.forEach((key) => {
    const value = body[key];
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  if (body.photo instanceof File) {
    formData.append('photo', body.photo);
    formData.append('file-photo', body.photo);
  }
  return formData;
}

function toTrainerFormData(body = {}) {
  const formData = new FormData();
  const fields = ['name', 'address', 'experience', 'phone_number', 'age', 'sex', 'status'];
  fields.forEach((key) => {
    const value = body[key];
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  if (body.photo instanceof File) {
    formData.append('photo', body.photo);
    formData.append('file-photo', body.photo);
  }
  return formData;
}

export async function getClients({ token, id } = {}) {
  const query = new URLSearchParams();
  if (id) query.set('id', String(id));
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/api/client/get${suffix}`, { token });
}

export async function createClient(body, token) {
  return apiRequest('/api/client/create', { method: 'POST', body: toClientFormData(body), token });
}

export async function updateClient(id, body, token) {
  return apiRequest(`/api/client/update/${id}`, { method: 'PUT', body: toClientFormData(body), token });
}

export async function deleteClient(id, token) {
  return apiRequest(`/api/client/delete/${id}`, { method: 'DELETE', token });
}

export async function createQrClient(companyId, body, token) {
  return apiRequest(`/api/client/create/${companyId}`, { method: 'POST', body: toQrClientFormData(body), token });
}

export async function checkInClientAttendance(companyId, body, token) {
  return apiRequest(`/api/client/attendance/check-in/${companyId}`, { method: 'POST', body, token });
}

export async function checkOutClientAttendance(attendanceId, body, token) {
  return apiRequest(`/api/client/attendance/check-out/${attendanceId}`, { method: 'POST', body, token });
}

export async function getTrainers({ token, id } = {}) {
  const query = new URLSearchParams();
  if (id) query.set('id', String(id));
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/api/trainer/get${suffix}`, { token });
}

export async function createTrainer(body, token) {
  return apiRequest('/api/trainer/create', { method: 'POST', body: toTrainerFormData(body), token });
}

export async function updateTrainer(id, body, token) {
  return apiRequest(`/api/trainer/update/${id}`, { method: 'PUT', body: toTrainerFormData(body), token });
}

export async function deleteTrainer(id, token) {
  return apiRequest(`/api/trainer/delete/${id}`, { method: 'DELETE', token });
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
