import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Api } from '../services/api';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private apiService: Api,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    console.log('AuthGuard: Checking authentication...');
    
    return this.apiService.getUserdataFromGoogle().pipe(
      tap(response => {
        console.log('AuthGuard: Authentication successful:', response);
      }),
      map(() => {
        console.log('AuthGuard: Allowing access to dashboard');
        return true; // ถ้า API เรียกสำเร็จ แสดงว่ามี authentication
      }),
      catchError((error) => {
        console.error('AuthGuard: Authentication failed:', error);
        // ถ้า API เรียกไม่สำเร็จ ให้ redirect ไปหน้า home
        console.log('AuthGuard: Redirecting to home page');
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
} 