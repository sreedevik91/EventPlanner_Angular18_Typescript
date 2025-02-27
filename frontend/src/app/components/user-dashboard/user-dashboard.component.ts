import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit{
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  services = [
    { title: 'Wedding', image: 'https://www.shaadidukaan.com/vogue/wp-content/uploads/2020/03/resort-in-jodhpur.jpg', description:'',path:'/events' },
    { title: 'Engagement', image: 'https://images.prismic.io/memoriesdesigner/70ae38f0-a465-4ad8-9f09-28d9fc49204e_MD1_2253.jpg?auto=compress,format&rect=0,0,5793,3864&w=4000&h=667', description:'',path:'/events' },
    { title: 'Birthday', image: 'https://5.imimg.com/data5/SELLER/Default/2022/1/YD/EW/SC/47467000/waddling-planning-500x500.jpg', description:'',path:'/events' },
    { title: 'Services', image: 'https://www.nace.net/sites/default/files/inline-images/The%20Best%20Banquet%20Set-Up%20Checklist%20qwick%20.jpg', description:'',path:'/services' }
  ];
}
