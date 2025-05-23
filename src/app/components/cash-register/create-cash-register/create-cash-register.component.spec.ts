import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCashRegisterComponent } from './create-cash-register.component';

describe('CreateCashRegisterComponent', () => {
  let component: CreateCashRegisterComponent;
  let fixture: ComponentFixture<CreateCashRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCashRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
