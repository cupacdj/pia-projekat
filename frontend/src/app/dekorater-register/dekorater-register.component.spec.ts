import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterRegisterComponent } from './dekorater-register.component';

describe('DekoraterRegisterComponent', () => {
  let component: DekoraterRegisterComponent;
  let fixture: ComponentFixture<DekoraterRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterRegisterComponent]
    });
    fixture = TestBed.createComponent(DekoraterRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
