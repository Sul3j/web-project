import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  @HostListener('window:load', ['$event'])
  offPreLoader(){
    setTimeout(() => {
      const preloader = document.querySelector('.preloader') as any;
      preloader.style.display = 'none';
    }, 1500)
  }
}
