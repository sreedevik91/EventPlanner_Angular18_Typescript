import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Carousel } from 'bootstrap';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit,AfterViewInit{
  ngAfterViewInit(): void {
    const myCarousel = new Carousel('#carouselExampleInterval', {
      interval: 2000,
      ride: 'carousel'
    });
  }
  ngOnInit(): void { }

  services = [
    { title: 'Wedding', image: 'https://www.shaadidukaan.com/vogue/wp-content/uploads/2020/03/resort-in-jodhpur.jpg', description:'',path:'/events' },
    { title: 'Engagement', image: 'https://images.prismic.io/memoriesdesigner/70ae38f0-a465-4ad8-9f09-28d9fc49204e_MD1_2253.jpg?auto=compress,format&rect=0,0,5793,3864&w=4000&h=667', description:'',path:'/events' },
    { title: 'Birthday', image: 'https://5.imimg.com/data5/SELLER/Default/2022/1/YD/EW/SC/47467000/waddling-planning-500x500.jpg', description:'',path:'/events' },
    { title: 'Services', image: 'https://www.nace.net/sites/default/files/inline-images/The%20Best%20Banquet%20Set-Up%20Checklist%20qwick%20.jpg', description:'',path:'/services' }
  ];

  eventImages:string[]=[
'https://www.mbatuts.com/wp-content/uploads/2019/11/Event-Planning-Business-in-plan.jpg',
'https://thumbs.dreamstime.com/b/elegant-event-management-tips-beautifully-styled-venue-night-stylish-decorations-set-tone-upscale-evening-337954260.jpg',
'https://cdn0.weddingwire.in/vendor/3385/3_2/960/jpg/magical-moments-4_15_243385-1568177294.jpeg',
'https://5.imimg.com/data5/DO/SS/FB/SELLER-63370074/marriage-event-500x500.jpg',
'https://www.v3events.in/images/slider/v3_f1.jpg',
'https://content.jdmagicbox.com/v2/comp/bangalore/v3/080pxx80.xx80.220319005648.u9v3/catalogue/sahana-art-and-event-s-manjunatha-galli-bangalore-event-organisers-icyleogdsc.jpg'
  ]

}
