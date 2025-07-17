import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishPerformanceComponent } from './dish-performance.component';

describe('DishPerformanceComponent', () => {
  let component: DishPerformanceComponent;
  let fixture: ComponentFixture<DishPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
