import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterPerformanceComponent } from './waiter-performance.component';

describe('WaiterPerformanceComponent', () => {
  let component: WaiterPerformanceComponent;
  let fixture: ComponentFixture<WaiterPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
