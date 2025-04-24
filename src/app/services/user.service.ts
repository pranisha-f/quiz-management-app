import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private userIdSubject = new BehaviorSubject<string | null>(null); // Store userId
  private userNameSubject = new BehaviorSubject<string | null>(null); // Store userName
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  setUserRole(userRole: string) {
    this.userRoleSubject.next(userRole);
  }

  setUserId(userId: string) {
    this.userIdSubject.next(userId); // Set userId
  }

  getUserId() {
    return this.userIdSubject.getValue(); // Observable userId
  }

  setUserName(name: string) {
    // Use name instead of userName
    this.userNameSubject.next(name); // Set name
  }

  getUserName() {
    return this.userNameSubject.getValue(); // Observable name
  }

  getUserRole(): string | null {
    return this.userRoleSubject.getValue();
  }

  loginUser(userId: string) {
    this.http
      .get<any>(`http://localhost:3000/users/${userId}`)
      .subscribe((user) => {
        if (user) {
          this.setUserRole(user.role);
        }
      });
  }

  // Clear user on logout
  clearUserData() {
    this.userIdSubject.next(null);
    this.userNameSubject.next(null);
    this.userRoleSubject.next(null);
  }
}
