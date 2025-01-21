import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequisitionComponent } from './add-requisition.component';

describe('AddRequisitionComponent', () => {
  let component: AddRequisitionComponent;
  let fixture: ComponentFixture<AddRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequisitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
