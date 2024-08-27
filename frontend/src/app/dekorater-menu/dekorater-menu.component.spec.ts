import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterMenuComponent } from './dekorater-menu.component';

describe('DekoraterMenuComponent', () => {
  let component: DekoraterMenuComponent;
  let fixture: ComponentFixture<DekoraterMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterMenuComponent]
    });
    fixture = TestBed.createComponent(DekoraterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
