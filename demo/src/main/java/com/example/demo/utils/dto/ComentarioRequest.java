package com.example.demo.utils.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioRequest {
    
    @NotBlank(message = "El contenido del comentario es obligatorio")
    @Size(min = 3, message = "El comentario debe tener al menos 3 caracteres")
    private String contenido;
    
    @NotNull(message = "El ID del tema es obligatorio")
    private Long temaId;
}