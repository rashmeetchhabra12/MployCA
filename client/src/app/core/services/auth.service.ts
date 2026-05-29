import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { AppUser, LoginPayload, LoginResponse } from '../models/api.models';

const TOKEN_KEY = 'mployas_token';
const USER_KEY = 'mployas_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userState = signal<AppUser | null>(this.restoreUser());

  readonly currentUser = computed(() => this.userState());
  readonly isLoggedIn = computed(() => Boolean(this.userState() && this.token));
  readonly isAdmin = computed(() => this.userState()?.role === 'Admin');

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  get token() {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        this.userState.set(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userState.set(null);
    this.router.navigateByUrl('/login');
  }

  refreshProfile(user: AppUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userState.set(user);
  }

  private restoreUser() {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AppUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
}
