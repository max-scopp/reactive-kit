import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewBComponent } from './view-b.component';

describe('ViewBComponent', () => {
  let component: ViewBComponent;
  let fixture: ComponentFixture<ViewBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
