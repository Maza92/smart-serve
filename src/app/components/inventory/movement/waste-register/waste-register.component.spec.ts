import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteRegisterComponent } from './waste-register.component';

describe('WasteRegisterComponent', () => {
  let component: WasteRegisterComponent;
  let fixture: ComponentFixture<WasteRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasteRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WasteRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
