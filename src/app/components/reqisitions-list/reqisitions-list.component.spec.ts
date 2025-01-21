import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqisitionsListComponent } from './reqisitions-list.component';

describe('ReqisitionsListComponent', () => {
  let component: ReqisitionsListComponent;
  let fixture: ComponentFixture<ReqisitionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqisitionsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReqisitionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
