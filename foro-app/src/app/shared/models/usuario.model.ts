export interface Usuario {
    id: number;
    nombre: string;
    username: string;
    email: string;
    rol: string;
    estaActivo: boolean;
    fechaRegistro: Date;
    token?: string;
  }
  
  export interface RegistroRequest {
    nombre: string;
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }