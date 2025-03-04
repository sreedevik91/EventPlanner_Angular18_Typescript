import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BookingService } from '../../services/bookingService/booking.service';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpStatusCodes, IBooking, IResponse } from '../../model/interface/interface';
import { DatePipe } from '@angular/common';
import { Carousel } from 'bootstrap';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.css'
})
export class ProviderDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  bookingService = inject(BookingService)
  userService = inject(UserSrerviceService)

  destroy$: Subject<void> = new Subject<void>()

  providerId: string = ''

  providerBookings = signal<(Partial<IBooking>[])>([])

  serviceImages: string[] = [
    'https://img.freepik.com/premium-photo/indian-family-hosting-feast-relatives-their-hospitality-showcased-array-mouthwatering-dishes-served-with-love-hospitality_748982-26497.jpg',
    'https://i.pinimg.com/736x/38/14/51/3814511ac13b1604a34fd962e7e95506.jpg',
    'https://cdn-blog.superprof.com/blog_in/wp-content/uploads/2020/01/in-photo-photo-1.jpg',
    'https://t4.ftcdn.net/jpg/11/29/76/41/360_F_1129764153_HxWvD8c8V0aFmzy3dOnohnl59J5YUkjX.jpg',
    'https://image.wedmegood.com/resized/720X/uploads/member/2841885/1684403920_344358842_548526770696435_7864237320086027825_n.jpg?crop=74,4,1357,763',
    'https://freelanceservicesindia.com/wp-content/uploads/2022/12/Videography-Company-in-Delhi-India.jpg',
    'https://5.imimg.com/data5/SELLER/Default/2024/7/434181103/WL/EI/GJ/62970306/indian-food-catering-service.png',
    'https://www.paperlesspost.com/blog/wp-content/uploads/072922_Blog_70thBirthdayPartyIdeas_01-hero.png'
  ]

  ngOnInit(): void {
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.providerId = user.id
      }
    })
    this.getServicesByProvider()
  }

  ngAfterViewInit(): void {
    const myCarousel = new Carousel('#carouselExampleInterval', {
      interval: 2000,
      ride: 'carousel'
    })
  }

  getServicesByProvider() {
    this.bookingService.getBookingsByProvider(this.providerId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('getServicesByProvider response: ', res.body);
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log('service booking response: ', res.body?.data);
          this.providerBookings.set(res.body?.data)
          console.log('service bookings list: ', this.providerBookings);

        } else {
          console.log(res.body?.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log('getServicesByProvider error: ', error.error.message, error);

      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
