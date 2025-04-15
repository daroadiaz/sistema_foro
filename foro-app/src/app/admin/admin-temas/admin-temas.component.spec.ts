import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTemasComponent } from './admin-temas.component';

describe('AdminTemasComponent', () => {
  let component: AdminTemasComponent;
  let fixture: ComponentFixture<AdminTemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTemasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
