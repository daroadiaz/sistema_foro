package com.example.demo.utils.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String username;
    private String email;
    private String rol;
    private boolean estaActivo;
    private LocalDateTime fechaRegistro;
    private String token;
    
    public UsuarioResponse(Long id, String nombre, String username, String email, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.username = username;
        this.email = email;
        this.rol = rol;
    }
    
    public UsuarioResponse(Long id, String nombre, String username, String email, String rol, boolean estaActivo, LocalDateTime fechaRegistro) {
        this.id = id;
        this.nombre = nombre;
        this.username = username;
        this.email = email;
        this.rol = rol;
        this.estaActivo = estaActivo;
        this.fechaRegistro = fechaRegistro;
    }
}