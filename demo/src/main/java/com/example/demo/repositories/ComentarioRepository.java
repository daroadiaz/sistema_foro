package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.Comentario;
import com.example.demo.entities.Tema;
import com.example.demo.entities.Usuario;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    
    List<Comentario> findByAutor(Usuario autor);
    
    List<Comentario> findByTema(Tema tema);
    
    Page<Comentario> findByTema(Tema tema, Pageable pageable);
    
    Page<Comentario> findByEstaBaneado(boolean estaBaneado, Pageable pageable);
    
    int countByTema(Tema tema);
    
    int countByAutor(Usuario autor);
}