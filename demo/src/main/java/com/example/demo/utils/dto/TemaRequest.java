package com.example.demo.utils.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemaRequest {
    
    private String titulo;
    private String contenido;
    private Long categoriaId;
}