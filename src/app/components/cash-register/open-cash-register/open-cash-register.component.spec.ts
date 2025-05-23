import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCashRegisterComponent } from './open-cash-register.component';

describe('OpenCashRegisterComponent', () => {
  let component: OpenCashRegisterComponent;
  let fixture: ComponentFixture<OpenCashRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenCashRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
