import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatuesListComponent } from './signatues-list.component';

describe('SignatuesListComponent', () => {
  let component: SignatuesListComponent;
  let fixture: ComponentFixture<SignatuesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatuesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
