import { Usuario } from './usuario.model';

export interface Comentario {
  id: number;
  contenido: string;
  fechaCreacion: Date;
  ultimaActualizacion?: Date;
  autor: Usuario;
  temaId: number;
  estaBaneado: boolean;
  razonBaneo?: string;
}

export interface ComentarioRequest {
  contenido: string;
  temaId: number;
}