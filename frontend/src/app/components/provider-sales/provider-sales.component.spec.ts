import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSalesComponent } from './provider-sales.component';

describe('ProviderSalesComponent', () => {
  let component: ProviderSalesComponent;
  let fixture: ComponentFixture<ProviderSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
