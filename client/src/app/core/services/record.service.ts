import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { AccessRecord } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class RecordService {
  constructor(private readonly http: HttpClient) {}

  list(delayMs = 1500) {
    return this.http.get<AccessRecord[]>(`${API_BASE_URL}/records`, { params: { delayMs } });
  }
}
