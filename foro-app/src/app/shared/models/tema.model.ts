import { Usuario } from './usuario.model';

export interface Tema {
  id: number;
  titulo: string;
  contenido: string;
  fechaCreacion: Date;
  ultimaActualizacion?: Date;
  autor: Usuario;
  nombreCategoria: string;
  estaBaneado: boolean;
  razonBaneo?: string;
  numeroComentarios: number;
}

export interface TemaRequest {
  titulo: string;
  contenido: string;
  categoriaId: number;
}