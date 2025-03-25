package com.example.demo.utils.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemaResponse {
    
    private Long id;
    private String titulo;
    private String contenido;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimaActualizacion;
    private UsuarioResponse autor;
    private String categoria;
    private boolean estaBaneado;
    private String razonBaneo;
}