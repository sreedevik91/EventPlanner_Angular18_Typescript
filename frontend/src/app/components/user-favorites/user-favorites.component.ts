import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { Subject, takeUntil } from 'rxjs';
import { HttpStatusCodes, IBooking, IRazorpayResponse, IResponse } from '../../model/interface/interface';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AlertService } from '../../services/alertService/alert.service';
import { BookingService } from '../../services/bookingService/booking.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-user-favorites',
  standalone: true,
  imports: [DatePipe, ButtonComponent, AlertComponent],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.css'
})
export default class UserFavoritesComponent implements OnInit, OnDestroy {

  @ViewChild('modal') bookingConfirmModal!: ElementRef

  destroy$: Subject<void> = new Subject<void>()

  bookingsList = signal<IBooking[]>([])

  totalBooking: number = 0
  isBookingSuccess: boolean= false
  confirmationMessage: string = ''

  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)
  bookingService = inject(BookingService)

  route = inject(Router)
  cdr=inject(ChangeDetectorRef)

  userId: string = ''

  ngOnInit(): void {
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user: any) => {
      this.userId = user.id
    })
    this.getBookingsByUser(this.userId)
  }

  getBookingsByUser(userId: string) {
    this.bookingService.getBookingsByUserId(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.bookingsList.set(res.body?.data)
          this.bookingsList.update(bookings=>
            bookings.filter(booking=>booking.isConfirmed===false)
          )
          console.log(this.bookingsList);

        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
  }

  deleteBooking(bookingId: string) {
    // if (confirm('Do you want to delete the booking ?')) {
    this.bookingService.deleteBooking(bookingId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log(res.body);
          // this.getBookingsByUser(this.userId)
          this.bookingsList.update(bookings =>
            bookings.filter(booking => booking._id !== bookingId)
          )
          this.totalBooking -= 1
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Delete Booking Failed", error.error.message)

      }
    })
    // }
  }

  deleteChoice(bookingId: string, name: string, id: string) {
    // if (confirm('Do you want to delete the service ?')) {
    this.bookingService.deleteBookedServices(bookingId, name, id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log(res.body);
          // this.getBookingsByUser(this.userId)
          this.bookingsList.update(bookings =>
            // flatMap - Handles both updating services and potential booking removal
            bookings.flatMap(booking => {
              // First filter the services
              let filteredService = booking.services.filter(service => service._id !== id)
              // Check if any services remain
              if (filteredService.length > 0) {
                // Return updated booking with filtered services
                return { ...booking, services: filteredService }
              }
              // Return empty array to remove the booking completely
              return []
            }))
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
    // }
  }

  confirmBooking(bookingId: string) {
    this.bookingService.confirmBooking(bookingId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          const { razorpayOrderId, amount } = res.body?.data
          console.log('razorpay orderId: ', razorpayOrderId, ' ,razorpay payment amount:  ', amount);
          this.openRazorpayModal(amount, razorpayOrderId, bookingId)
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
  }

  openRazorpayModal(amount: number, razorpayOrderId: string, bookingId: string) {
    try {
      var options = {
        "key": environment.razorpayKeyId, // Enter the Key ID generated from the Dashboard
        "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp", //your business name
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": razorpayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": (response: any) => {
          // alert(response.razorpay_payment_id);
          // alert(response.razorpay_order_id);
          // alert(response.razorpay_signature)
          console.log('razorpay payment id: ', response.razorpay_payment_id, ' ,razorpay order id: ', response.razorpay_order_id, ' ,razorpay signature: ', response.razorpay_signature);
          this.verifyPayment({ razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature, bookingId })
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          "name": "Gaurav Kumar", //your customer's name
          "email": "gaurav.kumar@example.com",
          "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
          "address": "Razorpay Corporate Office"
        },
        "theme": {
          "color": "#3399cc"
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on('payment.failed',(response:any)=>{
        console.log('razorpay error code: ',response.error.code);
        console.log('razorpay error description',response.error.description);
        console.log('razorpay error source',response.error.source);
        console.log('razorpay error step',response.error.step);
        console.log('razorpay error reason',response.error.reason);
        console.log('razorpay order id',response.error.metadata.order_id);
        console.log('razorpay payment id',response.error.metadata.payment_id);

        if (response.error.reason === 'payment_cancelled') {
          // User explicitly closed the Razorpay modal
          console.log('Payment cancelled by user');
          this.alertService.getAlert("alert alert-danger", "Failed", 'Payment cancelled by user')
        } else if (response.error.reason === 'payment_failed') {
          // Handle other failure reasons
          console.log('Payment failed:', response.error.reason);
          this.alertService.getAlert("alert alert-danger", "Failed", 'Payment failed')
        }else{
          this.alertService.getAlert("alert alert-danger", "Failed", response.error.reason)

        }
});

    } catch (error) {
      console.log('openRazorpayModal error: ', error);

    }

  }

  verifyPayment(razorpayResponse: IRazorpayResponse) {
    this.bookingService.verifyPayment(razorpayResponse).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          if(res.body?.success){
            this.isBookingSuccess = true
            this.confirmationMessage = 'Booking confirmed.'
          }else{
            this.isBookingSuccess = false
            this.confirmationMessage =  'Sorry! Payment failed, please try again!'
          }

          console.log('razorpay verifyPayment: ', res.body);

          console.log('isBookingSuccess value: ',this.isBookingSuccess);
          this.cdr.detectChanges()
          this.showModal()
        } else {
          console.log(res.body?.message);
          this.confirmationMessage = 'Sorry! Payment failed, please try again!'

          // this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
          this.cdr.detectChanges()

          this.showModal()
        }
      },
      error: (error: HttpErrorResponse) => {
        // this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)
        console.log('verifyPayment error: ', error.error.message);
        this.confirmationMessage = 'Sorry! Payment failed, please try again!'
        this.cdr.detectChanges()
        this.showModal()
      }
    })
  }

  showModal() {
    console.log('isBookingSuccess value when model opens: ',this.isBookingSuccess);
    console.log('confirmationMessage message when model opens: ',this.confirmationMessage);

    this.bookingConfirmModal.nativeElement.style.display = 'block'
  }

  hideModal() {
    // debugger
    this.bookingConfirmModal.nativeElement.style.display = 'none'
    // this.isBookingSuccess = false
  }

  goToBookings() {
    // debugger
    this.route.navigateByUrl('booking')
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}


