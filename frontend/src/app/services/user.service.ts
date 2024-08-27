import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000/user";

  login(username: string, password: string) {
    let data = {
      username: username,
      password: password
    }
    return this.http.post<{message:  string, user: User}>(`${this.url}/login`, data)
  }

  registerUser(formData: FormData) {
    return this.http.post<{message: string}>(`${this.url}/register`, formData);
  }

  changePassword(username: string, oldPassword: string, newPassword: string) {
    let data = {username, oldPassword, newPassword };
    return this.http.post<{ message: string }>(`${this.url}/change-password`, data);
  }

}
