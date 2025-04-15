import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { RecuperarPasswordComponent } from './auth/recuperar-password/recuperar-password.component';

import { HomeComponent } from './foro/home/home.component';
import { CategoriasComponent } from './foro/categorias/categorias.component';
import { TemaDetalleComponent } from './foro/tema-detalle/tema-detalle.component';
import { NuevoTemaComponent } from './foro/nuevo-tema/nuevo-tema.component';
import { EditarTemaComponent } from './foro/editar-tema/editar-tema.component';
import { ComentarioComponent } from './foro/comentario/comentario.component';
import { BuscarComponent } from './foro/buscar/buscar.component';

import { PerfilUsuarioComponent } from './perfil/perfil-usuario/perfil-usuario.component';
import { EditarPerfilComponent } from './perfil/editar-perfil/editar-perfil.component';
import { MisTemasComponent } from './perfil/mis-temas/mis-temas.component';
import { MisComentariosComponent } from './perfil/mis-comentarios/mis-comentarios.component';

import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminTemasComponent } from './admin/admin-temas/admin-temas.component';
import { AdminComentariosComponent } from './admin/admin-comentarios/admin-comentarios.component';
import { AdminUsuariosComponent } from './admin/admin-usuarios/admin-usuarios.component';
import { AdminCategoriasComponent } from './admin/admin-categorias/admin-categorias.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    RegistroComponent,
    RecuperarPasswordComponent,
    HomeComponent,
    CategoriasComponent,
    TemaDetalleComponent,
    NuevoTemaComponent,
    EditarTemaComponent,
    ComentarioComponent,
    BuscarComponent,
    PerfilUsuarioComponent,
    EditarPerfilComponent,
    MisTemasComponent,
    MisComentariosComponent,
    AdminDashboardComponent,
    AdminTemasComponent,
    AdminComentariosComponent,
    AdminUsuariosComponent,
    AdminCategoriasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }