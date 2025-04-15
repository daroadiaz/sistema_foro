package com.example.demo.utils.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BanRequest {
    
    @NotBlank(message = "La razón del baneo es obligatoria")
    @Size(min = 5, max = 255, message = "La razón del baneo debe tener entre 5 y 255 caracteres")
    private String razonBaneo;
}