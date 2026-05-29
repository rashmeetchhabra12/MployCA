import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { AppUser, UserForm } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly http: HttpClient) {}

  me() {
    return this.http.get<AppUser>(`${API_BASE_URL}/users/me`);
  }

  list() {
    return this.http.get<AppUser[]>(`${API_BASE_URL}/users`);
  }

  create(payload: UserForm) {
    return this.http.post<AppUser>(`${API_BASE_URL}/users`, payload);
  }

  update(id: string, payload: Partial<UserForm>) {
    return this.http.put<AppUser>(`${API_BASE_URL}/users/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/users/${id}`);
  }
}
