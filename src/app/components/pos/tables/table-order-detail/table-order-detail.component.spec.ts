import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOrderDetailComponent } from './table-order-detail.component';

describe('TableOrderDetailComponent', () => {
  let component: TableOrderDetailComponent;
  let fixture: ComponentFixture<TableOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableOrderDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
