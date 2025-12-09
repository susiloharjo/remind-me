import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  due_date: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  reminder_days_before: number[];
}

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = 'http://localhost:3000/api/reminders';

  constructor(private http: HttpClient) { }

  getReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(this.apiUrl);
  }

  createReminder(reminder: Omit<Reminder, 'id'>): Observable<Reminder> {
    return this.http.post<Reminder>(this.apiUrl, reminder);
  }

  updateReminder(id: string, reminder: Partial<Reminder>): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, reminder);
  }

  deleteReminder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteReminders(ids: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/batch-delete`, { ids });
  }

  importReminders(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import`, formData);
  }
}
