import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashMovementsComponent } from './cash-movements.component';

describe('CashMovementsComponent', () => {
  let component: CashMovementsComponent;
  let fixture: ComponentFixture<CashMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashMovementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
