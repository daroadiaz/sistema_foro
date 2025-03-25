package com.example.demo.controllers.forum;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Categoria;
import com.example.demo.services.forum.CategoriaService;
import com.example.demo.utils.dto.ApiResponse;
import com.example.demo.utils.dto.CategoriaRequest;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> crearCategoria(@RequestBody CategoriaRequest request) {
        try {
            Categoria categoria = categoriaService.crearCategoria(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Categoría creada correctamente", categoria));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> listarCategorias() {
        try {
            List<Categoria> categorias = categoriaService.listarCategorias();
            return ResponseEntity.ok(new ApiResponse(true, "Lista de categorías obtenida", categorias));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> obtenerCategoriaPorId(@PathVariable Long id) {
        try {
            Categoria categoria = categoriaService.obtenerCategoriaPorId(id);
            return ResponseEntity.ok(new ApiResponse(true, "Categoría encontrada", categoria));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizarCategoria(
            @PathVariable Long id, 
            @RequestBody CategoriaRequest request) {
        try {
            Categoria categoria = categoriaService.actualizarCategoria(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Categoría actualizada correctamente", categoria));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> eliminarCategoria(@PathVariable Long id) {
        try {
            categoriaService.eliminarCategoria(id);
            return ResponseEntity.ok(new ApiResponse(true, "Categoría eliminada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}