import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgReactiveLibComponent } from './ng-reactive-lib.component';

describe('NgReactiveLibComponent', () => {
  let component: NgReactiveLibComponent;
  let fixture: ComponentFixture<NgReactiveLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgReactiveLibComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgReactiveLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
