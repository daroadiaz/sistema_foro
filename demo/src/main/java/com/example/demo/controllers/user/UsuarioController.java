package com.example.demo.controllers.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.services.user.UsuarioService;
import com.example.demo.utils.dto.ApiResponse;
import com.example.demo.utils.dto.RegistroRequest;
import com.example.demo.utils.dto.UsuarioResponse;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping
    public ResponseEntity<ApiResponse> listarUsuarios() {
        try {
            List<UsuarioResponse> usuarios = usuarioService.listarUsuarios();
            return ResponseEntity.ok(new ApiResponse(true, "Lista de usuarios obtenida", usuarios));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioResponse usuario = usuarioService.obtenerUsuarioPorId(id);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario encontrado", usuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse> obtenerUsuarioPorUsername(@PathVariable String username) {
        try {
            UsuarioResponse usuario = usuarioService.obtenerUsuarioPorUsername(username);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario encontrado", usuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizarUsuario(
            @PathVariable Long id, 
            @RequestBody RegistroRequest request) {
        try {
            UsuarioResponse usuario = usuarioService.actualizarUsuario(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario actualizado correctamente", usuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<ApiResponse> desactivarUsuario(@PathVariable Long id) {
        try {
            usuarioService.desactivarUsuario(id);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario desactivado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/activar")
    public ResponseEntity<ApiResponse> activarUsuario(@PathVariable Long id) {
        try {
            usuarioService.activarUsuario(id);
            return ResponseEntity.ok(new ApiResponse(true, "Usuario activado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}