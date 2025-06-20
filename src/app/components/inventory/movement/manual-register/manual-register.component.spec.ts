import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualRegisterComponent } from './manual-register.component';

describe('ManualRegisterComponent', () => {
  let component: ManualRegisterComponent;
  let fixture: ComponentFixture<ManualRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
