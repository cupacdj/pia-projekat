import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterProfileComponent } from './dekorater-profile.component';

describe('DekoraterProfileComponent', () => {
  let component: DekoraterProfileComponent;
  let fixture: ComponentFixture<DekoraterProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterProfileComponent]
    });
    fixture = TestBed.createComponent(DekoraterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
