import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisComentariosComponent } from './mis-comentarios.component';

describe('MisComentariosComponent', () => {
  let component: MisComentariosComponent;
  let fixture: ComponentFixture<MisComentariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisComentariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisComentariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
