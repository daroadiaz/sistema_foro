import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss']
})
export class RecuperarPasswordComponent implements OnInit {
  recuperarForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.recuperarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.recuperarForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.recuperarForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Aquí implementarías la lógica para enviar el email de recuperación
    // Por ahora solo simulamos una respuesta exitosa
    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.';
    }, 1500);
  }
}