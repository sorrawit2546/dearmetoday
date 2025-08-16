import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Api, AuthResponse} from './api';
import { User } from '../model/api-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: Api) {
    // ตรวจสอบ authentication state เมื่อเริ่มต้น
    this.checkAuthState();
  }

  checkAuthState(): void {
    console.log('AuthService: Checking authentication state...');
    this.apiService.getUserdataFromGoogle().subscribe({
      next: (response: AuthResponse) => {
        console.log('AuthService: User authenticated:', response.user);
        this.currentUserSubject.next(response.user);
        console.log('AuthService: currentUserSubject updated');
      },
      error: (error) => {
        console.log('AuthService: User not authenticated:', error);
        this.currentUserSubject.next(null);
      },
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  logout(): Observable<any> {
    return this.apiService.logout();
  }
}
