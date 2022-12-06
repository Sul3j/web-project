import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MovieDto} from "../dtos/movie.dto";
import {ToastrModule, ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private readonly url: string = 'http://localhost:5000/movies';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getAllMovies() {
    return this.http.get<any>(`${this.url}/all`).toPromise().then();
  }

  uploadImage(formData: FormData): Observable<any> {
    this.toastr.success('Dodano zdjęcie pomyślnie!');

    return this.http.post<any>(`${this.url}/add`,  formData, {
      observe: 'events',
    });
  }

  deleteImage(filename: string) {
    return this.http
      .delete<any>(`${this.url}/image/delete/${filename}`)
      .pipe();
  }
}
