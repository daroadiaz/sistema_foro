import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaDetalleComponent } from './tema-detalle.component';

describe('TemaDetalleComponent', () => {
  let component: TemaDetalleComponent;
  let fixture: ComponentFixture<TemaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemaDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
