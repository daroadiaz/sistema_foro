package com.example.demo.utils.dto;

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
}