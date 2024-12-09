import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventServicesComponent } from './event-services.component';

describe('EventServicesComponent', () => {
  let component: EventServicesComponent;
  let fixture: ComponentFixture<EventServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
