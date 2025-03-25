package com.example.demo.services.forum;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Categoria;
import com.example.demo.repositories.CategoriaRepository;
import com.example.demo.utils.dto.CategoriaRequest;

@Service
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public Categoria crearCategoria(CategoriaRequest request) {
        if (categoriaRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }
        
        Categoria categoria = new Categoria(
            request.getNombre(),
            request.getDescripcion()
        );
        
        return categoriaRepository.save(categoria);
    }
    
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }
    
    public Categoria obtenerCategoriaPorId(Long id) {
        return categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }
    
    public Categoria actualizarCategoria(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        if (!categoria.getNombre().equals(request.getNombre()) &&
            categoriaRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }
        
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        
        return categoriaRepository.save(categoria);
    }
    
    public void eliminarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        if (!categoria.getTemas().isEmpty()) {
            throw new RuntimeException("No se puede eliminar una categoría que tiene temas");
        }
        
        categoriaRepository.delete(categoria);
    }
}