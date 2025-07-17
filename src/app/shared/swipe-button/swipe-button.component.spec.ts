import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeButtonComponent } from './swipe-button.component';

describe('SwipeButtonComponent', () => {
  let component: SwipeButtonComponent;
  let fixture: ComponentFixture<SwipeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwipeButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwipeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
