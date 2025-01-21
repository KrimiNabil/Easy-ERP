import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurshaseOrdersListComponent } from './purshase-orders-list.component';

describe('PurshaseOrdersListComponent', () => {
  let component: PurshaseOrdersListComponent;
  let fixture: ComponentFixture<PurshaseOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurshaseOrdersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurshaseOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
