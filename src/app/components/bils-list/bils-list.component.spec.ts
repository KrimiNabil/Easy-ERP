import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilsListComponent } from './bils-list.component';

describe('BilsListComponent', () => {
  let component: BilsListComponent;
  let fixture: ComponentFixture<BilsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BilsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BilsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
