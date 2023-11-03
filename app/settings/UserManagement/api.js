import * as http from 'core/http/http';
import settings from 'core/settings/settings';

const base = settings.FACIT_API;
export function getUserRoles() {
  const res = http.get(`${base}/v1/user-roles`, null, true, {});

  return res;
}

export function getUsers() {
  const res = http.get(`${base}/v1/users`, null, true, {});

  return res;
}

export function assignUserRoles(subjectId, roleIds) {
  const res = http.put(`${base}/v1/users/${subjectId}/assign`, roleIds, true, {});
  return res;
}

export function deleteUser(subjectId) {
  const res = http.delete(`${base}/v1/users/${subjectId}`, true, {});
  return res;
}

export function deleteUserRole(id) {
  const res = http.delete(`${base}/v1/user-roles/${id}`, true, {});
  return res;
}

export function createUserRole(roleName) {
  const res = http.post(`${base}/v1/user-roles`, { roleName: roleName }, true, {});
  return res;
}

export function roleUpdate(id, value) {
  const res = http.put(`${base}/v1/user-roles/${id}/update`, { claims: value }, true, {});
  return res;
}

export function getUserRegions() {
  return http.get(`${base}/v1/user-regions`);
}

export function assignUserRegions(subjectId, regionIds) {
  return http.put(`${base}/v1/user-regions/${subjectId}/assign`, regionIds, true, {});
}
