import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackBarLayoutComponent } from './back-bar-layout.component';

describe('BackBarLayoutComponent', () => {
  let component: BackBarLayoutComponent;
  let fixture: ComponentFixture<BackBarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackBarLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackBarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
