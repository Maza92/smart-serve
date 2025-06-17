import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishesCreateComponent } from './dishes-create.component';

describe('DishesCreateComponent', () => {
  let component: DishesCreateComponent;
  let fixture: ComponentFixture<DishesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
