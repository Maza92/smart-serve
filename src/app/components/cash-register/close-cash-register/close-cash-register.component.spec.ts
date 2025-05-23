import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCashRegisterComponent } from './close-cash-register.component';

describe('CloseCashRegisterComponent', () => {
  let component: CloseCashRegisterComponent;
  let fixture: ComponentFixture<CloseCashRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseCashRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
