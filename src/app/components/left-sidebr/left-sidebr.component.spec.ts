import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSidebrComponent } from './left-sidebr.component';

describe('LeftSidebrComponent', () => {
  let component: LeftSidebrComponent;
  let fixture: ComponentFixture<LeftSidebrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftSidebrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSidebrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
