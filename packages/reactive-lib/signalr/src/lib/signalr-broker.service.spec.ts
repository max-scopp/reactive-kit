import { TestBed } from '@angular/core/testing';

import { SignalrBrokerService } from './signalr-broker.service';

describe('SignalrBrokerService', () => {
  let service: SignalrBrokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrBrokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
