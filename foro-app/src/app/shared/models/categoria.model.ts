export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    temas?: any[]; // Añadimos esta propiedad opcional
  }
  
  export interface CategoriaRequest {
    nombre: string;
    descripcion: string;
  }