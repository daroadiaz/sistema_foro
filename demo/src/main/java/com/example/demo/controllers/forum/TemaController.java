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

import com.example.demo.services.forum.TemaService;
import com.example.demo.utils.dto.ApiResponse;
import com.example.demo.utils.dto.TemaRequest;
import com.example.demo.utils.dto.TemaResponse;

@RestController
@RequestMapping("/api/temas")
public class TemaController {
    
    @Autowired
    private TemaService temaService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> crearTema(
            @Valid @RequestBody TemaRequest request,
            @RequestParam String username) {
        try {
            TemaResponse tema = temaService.crearTema(request, username);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Tema creado correctamente", tema));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<ApiResponse> listarTemasPorCategoria(@PathVariable Long categoriaId) {
        try {
            List<TemaResponse> temas = temaService.listarTemasPorCategoria(categoriaId);
            return ResponseEntity.ok(new ApiResponse(true, "Lista de temas obtenida", temas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/categoria/{categoriaId}/pagina")
    public ResponseEntity<ApiResponse> listarTemasPorCategoriaPaginados(
            @PathVariable Long categoriaId,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio,
            @RequestParam(defaultValue = "fechaCreacion") String ordenarPor,
            @RequestParam(defaultValue = "desc") String direccion) {
        try {
            Sort.Direction dir = direccion.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(pagina, tamanio, Sort.by(dir, ordenarPor));
            
            Page<TemaResponse> temas = temaService.listarTemasPorCategoriaPaginados(categoriaId, pageable);
            return ResponseEntity.ok(new ApiResponse(true, "Lista de temas paginada obtenida", temas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/buscar/titulo")
    public ResponseEntity<ApiResponse> buscarTemasPorTitulo(
            @RequestParam String titulo,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio,
            @RequestParam(defaultValue = "fechaCreacion") String ordenarPor,
            @RequestParam(defaultValue = "desc") String direccion) {
        try {
            Sort.Direction dir = direccion.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(pagina, tamanio, Sort.by(dir, ordenarPor));
            
            Page<TemaResponse> temas = temaService.buscarTemasPorTitulo(titulo, pageable);
            return ResponseEntity.ok(new ApiResponse(true, "Resultados de búsqueda obtenidos", temas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse> buscarTemasPorTituloOContenido(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio,
            @RequestParam(defaultValue = "fechaCreacion") String ordenarPor,
            @RequestParam(defaultValue = "desc") String direccion) {
        try {
            Sort.Direction dir = direccion.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(pagina, tamanio, Sort.by(dir, ordenarPor));
            
            Page<TemaResponse> temas = temaService.buscarTemasPorTituloOContenido(query, pageable);
            return ResponseEntity.ok(new ApiResponse(true, "Resultados de búsqueda obtenidos", temas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> obtenerTemaPorId(@PathVariable Long id) {
        try {
            TemaResponse tema = temaService.obtenerTemaPorId(id);
            return ResponseEntity.ok(new ApiResponse(true, "Tema encontrado", tema));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{username}")
    public ResponseEntity<ApiResponse> listarTemasPorUsuario(@PathVariable String username) {
        try {
            List<TemaResponse> temas = temaService.listarTemasPorUsuario(username);
            return ResponseEntity.ok(new ApiResponse(true, "Lista de temas del usuario obtenida", temas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizarTema(
            @PathVariable Long id,
            @Valid @RequestBody TemaRequest request,
            @RequestParam String username) {
        try {
            TemaResponse tema = temaService.actualizarTema(id, request, username);
            return ResponseEntity.ok(new ApiResponse(true, "Tema actualizado correctamente", tema));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> eliminarTema(
            @PathVariable Long id,
            @RequestParam String username) {
        try {
            temaService.eliminarTema(id, username);
            return ResponseEntity.ok(new ApiResponse(true, "Tema eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}