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
    private String nombreCategoria;
    private boolean estaBaneado;
    private String razonBaneo;
    private int numeroComentarios;
    
    public TemaResponse(Long id, String titulo, String contenido, LocalDateTime fechaCreacion, 
                        LocalDateTime ultimaActualizacion, UsuarioResponse autor, 
                        String nombreCategoria, boolean estaBaneado, String razonBaneo) {
        this.id = id;
        this.titulo = titulo;
        this.contenido = contenido;
        this.fechaCreacion = fechaCreacion;
        this.ultimaActualizacion = ultimaActualizacion;
        this.autor = autor;
        this.nombreCategoria = nombreCategoria;
        this.estaBaneado = estaBaneado;
        this.razonBaneo = razonBaneo;
        this.numeroComentarios = 0;
    }
}