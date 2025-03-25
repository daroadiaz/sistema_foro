package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.Categoria;
import com.example.demo.entities.Tema;
import com.example.demo.entities.Usuario;

@Repository
public interface TemaRepository extends JpaRepository<Tema, Long> {
    
    List<Tema> findByAutor(Usuario autor);
    
    List<Tema> findByCategoria(Categoria categoria);
    
    Page<Tema> findByCategoria(Categoria categoria, Pageable pageable);
    
    Page<Tema> findByTituloContainingIgnoreCase(String titulo, Pageable pageable);
    
    Page<Tema> findByEstaBaneado(boolean estaBaneado, Pageable pageable);
}