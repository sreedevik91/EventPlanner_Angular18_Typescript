import { TestBed } from '@angular/core/testing';

import { UserSrerviceService } from './user-srervice.service';

describe('UserSrerviceService', () => {
  let service: UserSrerviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSrerviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
