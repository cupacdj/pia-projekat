import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Job from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000/company";

  createJob(job: Job) {
    return this.http.post<{message: string}>(`${this.url}/create-job`, job);
  }

}
