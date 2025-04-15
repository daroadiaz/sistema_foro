package com.example.demo.controllers.user;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.services.user.UsuarioService;
import com.example.demo.utils.dto.ApiResponse;
import com.example.demo.utils.dto.LoginRequest;
import com.example.demo.utils.dto.RegistroRequest;
import com.example.demo.utils.dto.UsuarioResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping("/registro")
    public ResponseEntity<ApiResponse> registrarUsuario(@Valid @RequestBody RegistroRequest request) {
        try {
            UsuarioResponse usuario = usuarioService.registrarUsuario(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Usuario registrado correctamente", usuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            UsuarioResponse usuario = usuarioService.login(request);
            return ResponseEntity.ok(new ApiResponse(true, "Login exitoso", usuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}