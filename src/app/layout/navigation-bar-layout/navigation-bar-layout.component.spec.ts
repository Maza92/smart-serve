import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarLayoutComponent } from './navigation-bar-layout.component';

describe('NavigationBarLayoutComponent', () => {
  let component: NavigationBarLayoutComponent;
  let fixture: ComponentFixture<NavigationBarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBarLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationBarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
