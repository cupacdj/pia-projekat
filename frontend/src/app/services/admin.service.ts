import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../models/user';
import Company from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:4000/admin';s

  getUsers(){
    return this.http.get<User[]>(`${this.url}/users`);
  }

  getCompanies(){
    return this.http.get<Company[]>(`${this.url}/companies`);
  }

  updateUser(selectedUser: User){
    return this.http.post<{message: string}>(`${this.url}/userUpdate`, selectedUser);
  }

  deactivateUser(user: User){
    return this.http.post<{message: string}>(`${this.url}/deactivateUser`, user);
  }

  activateUser(user: User){
    return this.http.post<{message: string}>(`${this.url}/activateUser`, user);
  }

  getPendingUsers(){
    return this.http.get<User[]>(`${this.url}/pendingUsers`);
  }

  getProfilePicture(picture: string, user: User){
    let data = {picture: picture};
    return this.http.post<Blob>(`${this.url}/profilePicture`, data, {responseType: 'blob' as 'json'});
  }

}
