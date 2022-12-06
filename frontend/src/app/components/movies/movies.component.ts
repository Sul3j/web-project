import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MoviesService} from "../../services/movies.service";
import {catchError, map, of} from "rxjs";
import {HttpErrorResponse, HttpEventType} from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MovieDto} from "../../dtos/movie.dto";

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  });

  preview!: string;

  filePath!: string;

  imagePath!: string;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0,
  };

  readonly url: string = 'http://localhost:5000/movies/photo/';

  movies!: any;

  constructor(private moviesService: MoviesService, private toastr: ToastrService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.movies = this.moviesService.getAllMovies();
    console.log(this.movies)
  }

  uploadFile() {
    console.log("upload file")
    const file = this.file;

    const formData = new FormData();

    console.log(this.form.value);

    formData.append('file', this.file.data);
    formData.append('name', this.form.value.name);
    formData.append('category', this.form.value.category);
    formData.append('description', this.form.value.description);

    console.log(formData);

    this.file.inProgress = true;

    this.moviesService
      .uploadImage(formData)
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.file.progress = Math.round(
                (event.loaded * 100) / event.total
              );
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.file.inProgress = false;
          return of('Upload failed');
        })
      )
      .subscribe();

    setTimeout(() => {
      this.movies = this.moviesService.getAllMovies();
    }, 200);
  }

  imageChange(event: Event) {
    console.log("image change")
    const element = event.target as HTMLInputElement;
    if (element.files && element.files[0]) {
      const fileReader = new FileReader();

      const handle = (e: ProgressEvent<FileReader>) => {
        this.imagePath = e.target?.result as string;
        fileReader?.removeEventListener('load', handle);
      };

      fileReader.addEventListener('load', handle);

      fileReader.readAsDataURL(element.files[0]);
    }
  }

  upload() {
    console.log("upload")
    const fileInput = this.fileUpload.nativeElement;

    fileInput.click();

    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0,
      };
      this.fileUpload.nativeElement.value = '';
    };
  }

  deleteImage(imagename: string) {
    if (imagename != this.preview) {
      this.moviesService.deleteImage(imagename).subscribe();
    }
    this.preview = imagename;

    this.toastr.success('Usunięto zdjęcie');
    setTimeout(() => {
      this.movies = this.moviesService.getAllMovies();
    }, 200);
  }
}
