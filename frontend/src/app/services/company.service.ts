import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Job from '../models/job';
import Company from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000/company";

  createJob(job: Job) {
    return this.http.post<{message: string}>(`${this.url}/create-job`, job);
  }

  getJobs(){
    return this.http.get<Job[]>(`${this.url}/jobs`);
  }

  updateJob(job: Job) {
    return this.http.post<{message: string}>(`${this.url}/update-job`, job);
  }

  cancelJob(job: Job) {
    return this.http.post<{message: string}>(`${this.url}/cancel-job`, job);
  }

  getCompany(company: string) {
    return this.http.post<{message: string, company: Company}>(`${this.url}/get-company`, company);
  }

  uploadJobPhoto(formData: FormData) {
    return this.http.post<{message: string}>(`${this.url}/upload-photo`, formData);
  }

  getJobPhoto(id: string) {
    let data = {_id: id};
    return this.http.post<Blob>(`${this.url}/get-photo`, data, {responseType: 'blob' as 'json'});
  }

}
