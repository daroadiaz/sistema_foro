import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTemaComponent } from './nuevo-tema.component';

describe('NuevoTemaComponent', () => {
  let component: NuevoTemaComponent;
  let fixture: ComponentFixture<NuevoTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoTemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
