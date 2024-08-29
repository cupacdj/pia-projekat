import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterSchedulingComponent } from './dekorater-scheduling.component';

describe('DekoraterSchedulingComponent', () => {
  let component: DekoraterSchedulingComponent;
  let fixture: ComponentFixture<DekoraterSchedulingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterSchedulingComponent]
    });
    fixture = TestBed.createComponent(DekoraterSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
