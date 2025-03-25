package com.example.demo.controllers.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.services.admin.AdminService;
import com.example.demo.services.user.UsuarioService;
import com.example.demo.utils.dto.ApiResponse;
import com.example.demo.utils.dto.BanRequest;
import com.example.demo.utils.dto.ComentarioResponse;
import com.example.demo.utils.dto.RegistroRequest;
import com.example.demo.utils.dto.TemaResponse;
import com.example.demo.utils.dto.UsuarioResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping("/registrar-admin")
    public ResponseEntity<ApiResponse> registrarAdministrador(
            @RequestBody RegistroRequest request,
            @RequestParam String adminUsername) {
        try {
            // Verificar que quien hace la solicitud es un administrador
            UsuarioResponse admin = usuarioService.obtenerUsuarioPorUsername(adminUsername);
            if (!"ADMINISTRADOR".equals(admin.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(false, "No tienes permisos de administrador"));
            }
            
            UsuarioResponse nuevoAdmin = usuarioService.registrarAdministrador(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Administrador registrado correctamente", nuevoAdmin));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/tema/{id}/banear")
    public ResponseEntity<ApiResponse> banearTema(
            @PathVariable Long id,
            @RequestBody BanRequest request,
            @RequestParam String adminUsername) {
        try {
            TemaResponse tema = adminService.banearTema(id, request, adminUsername);
            return ResponseEntity.ok(new ApiResponse(true, "Tema baneado correctamente", tema));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/tema/{id}/desbanear")
    public ResponseEntity<ApiResponse> desbanearTema(
            @PathVariable Long id,
            @RequestParam String adminUsername) {
        try {
            TemaResponse tema = adminService.desbanearTema(id, adminUsername);
            return ResponseEntity.ok(new ApiResponse(true, "Tema desbaneado correctamente", tema));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/comentario/{id}/banear")
    public ResponseEntity<ApiResponse> banearComentario(
            @PathVariable Long id,
            @RequestBody BanRequest request,
            @RequestParam String adminUsername) {
        try {
            ComentarioResponse comentario = adminService.banearComentario(id, request, adminUsername);
            return ResponseEntity.ok(new ApiResponse(true, "Comentario baneado correctamente", comentario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/comentario/{id}/desbanear")
    public ResponseEntity<ApiResponse> desbanearComentario(
            @PathVariable Long id,
            @RequestParam String adminUsername) {
        try {
            ComentarioResponse comentario = adminService.desbanearComentario(id, adminUsername);
            return ResponseEntity.ok(new ApiResponse(true, "Comentario desbaneado correctamente", comentario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/temas-baneados")
    public ResponseEntity<ApiResponse> listarTemasBaneados(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio,
            @RequestParam String adminUsername) {
        try {
            Pageable pageable = PageRequest.of(pagina, tamanio, Sort.by(Sort.Direction.DESC, "fechaCreacion"));
            Page<TemaResponse> temas = adminService.listarTemasBaneados(pageable, adminUsername);
            return ResponseEntity.ok(new ApiResponse(true, "Lista de temas baneados obtenida", temas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/comentarios-baneados")
    public ResponseEntity<ApiResponse> listarComentariosBaneados(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio,
            @RequestParam String adminUsername) {
        try {
            Pageable pageable = PageRequest.of(pagina, tamanio, Sort.by(Sort.Direction.DESC, "fechaCreacion"));
            Page<ComentarioResponse> comentarios = adminService.listarComentariosBaneados(pageable, adminUsername);
            return ResponseEntity.ok(new ApiResponse(true, "Lista de comentarios baneados obtenida", comentarios));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}