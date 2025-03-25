package com.example.demo.utils.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioResponse {
    
    private Long id;
    private String contenido;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimaActualizacion;
    private UsuarioResponse autor;
    private Long temaId;
    private boolean estaBaneado;
    private String razonBaneo;
}