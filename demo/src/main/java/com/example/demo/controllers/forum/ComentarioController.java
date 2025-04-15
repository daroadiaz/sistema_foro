package com.example.demo.controllers.forum;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.services.forum.ComentarioService;
import com.example.demo.utils.dto.ApiResponse;
import com.example.demo.utils.dto.ComentarioRequest;
import com.example.demo.utils.dto.ComentarioResponse;

@RestController
@RequestMapping("/api/comentarios")
public class ComentarioController {
    
    @Autowired
    private ComentarioService comentarioService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> crearComentario(
            @Valid @RequestBody ComentarioRequest request,
            @RequestParam String username) {
        try {
            ComentarioResponse comentario = comentarioService.crearComentario(request, username);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Comentario creado correctamente", comentario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/tema/{temaId}")
    public ResponseEntity<ApiResponse> listarComentariosPorTema(
            @PathVariable Long temaId,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio,
            @RequestParam(defaultValue = "fechaCreacion") String ordenarPor,
            @RequestParam(defaultValue = "asc") String direccion) {
        try {
            Sort.Direction dir = direccion.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(pagina, tamanio, Sort.by(dir, ordenarPor));
            
            Page<ComentarioResponse> comentarios = comentarioService.listarComentariosPorTema(temaId, pageable);
            return ResponseEntity.ok(new ApiResponse(true, "Lista de comentarios obtenida", comentarios));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{username}")
    public ResponseEntity<ApiResponse> listarComentariosPorUsuario(@PathVariable String username) {
        try {
            List<ComentarioResponse> comentarios = comentarioService.listarComentariosPorUsuario(username);
            return ResponseEntity.ok(new ApiResponse(true, "Lista de comentarios del usuario obtenida", comentarios));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> obtenerComentarioPorId(@PathVariable Long id) {
        try {
            ComentarioResponse comentario = comentarioService.obtenerComentarioPorId(id);
            return ResponseEntity.ok(new ApiResponse(true, "Comentario encontrado", comentario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizarComentario(
            @PathVariable Long id,
            @Valid @RequestBody ComentarioRequest request,
            @RequestParam String username) {
        try {
            ComentarioResponse comentario = comentarioService.actualizarComentario(id, request, username);
            return ResponseEntity.ok(new ApiResponse(true, "Comentario actualizado correctamente", comentario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> eliminarComentario(
            @PathVariable Long id,
            @RequestParam String username) {
        try {
            comentarioService.eliminarComentario(id, username);
            return ResponseEntity.ok(new ApiResponse(true, "Comentario eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}