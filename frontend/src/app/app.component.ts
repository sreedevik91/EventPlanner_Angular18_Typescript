import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserSrerviceService } from './services/userService/user-srervice.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'frontend';
  // userService=inject(UserSrerviceService)

  ngOnInit(): void {
    console.log('app component loaded');
    
    // this.userService.checkLoggedUser().subscribe()
  }

}
