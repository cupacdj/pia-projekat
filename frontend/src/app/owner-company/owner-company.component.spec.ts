import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCompanyComponent } from './owner-company.component';

describe('OwnerCompanyComponent', () => {
  let component: OwnerCompanyComponent;
  let fixture: ComponentFixture<OwnerCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerCompanyComponent]
    });
    fixture = TestBed.createComponent(OwnerCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
