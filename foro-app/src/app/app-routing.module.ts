import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';

import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { RecuperarPasswordComponent } from './auth/recuperar-password/recuperar-password.component';

import { HomeComponent } from './foro/home/home.component';
import { CategoriasComponent } from './foro/categorias/categorias.component';
import { TemaDetalleComponent } from './foro/tema-detalle/tema-detalle.component';
import { NuevoTemaComponent } from './foro/nuevo-tema/nuevo-tema.component';
import { EditarTemaComponent } from './foro/editar-tema/editar-tema.component';
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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'tema/:id', component: TemaDetalleComponent },
  { path: 'buscar', component: BuscarComponent },
  
  { path: 'nuevo-tema', component: NuevoTemaComponent, canActivate: [AuthGuard] },
  { path: 'editar-tema/:id', component: EditarTemaComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'editar-perfil', component: EditarPerfilComponent, canActivate: [AuthGuard] },
  { path: 'mis-temas', component: MisTemasComponent, canActivate: [AuthGuard] },
  { path: 'mis-comentarios', component: MisComentariosComponent, canActivate: [AuthGuard] },
  
  { 
    path: 'admin', 
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'temas', component: AdminTemasComponent },
      { path: 'comentarios', component: AdminComentariosComponent },
      { path: 'usuarios', component: AdminUsuariosComponent },
      { path: 'categorias', component: AdminCategoriasComponent }
    ]
  },
  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }