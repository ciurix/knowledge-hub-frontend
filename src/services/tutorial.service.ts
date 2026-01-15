import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3001/api/tutorials';

export interface Tutorial {
  _id?: string;
  title: string;
  description: string;
  published: boolean;
  authorId?: {
    email: string;
    role: string;
  } | string;
  sourceLink?: string;
  coverImage?: string;
  category?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private http = inject(HttpClient);

  // Signals to hold state if we want to share data across components easily
  tutorials = signal<Tutorial[]>([]);

  getAll(title?: string): Observable<Tutorial[]> {
    let url = API_URL;
    if (title) {
      url += `?title=${encodeURIComponent(title)}`;
    }
    return this.http.get<Tutorial[]>(url);
  }

  getMyTutorials(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${API_URL}/user/me`);
  }

  getById(id: string): Observable<Tutorial> {
    return this.http.get<Tutorial>(`${API_URL}/${id}`);
  }

  create(data: Partial<Tutorial>): Observable<Tutorial> {
    return this.http.post<Tutorial>(API_URL, data);
  }

  update(id: string, data: Partial<Tutorial>): Observable<Tutorial> {
    return this.http.put<Tutorial>(`${API_URL}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
