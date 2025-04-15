package com.example.demo.services.forum;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entities.Comentario;
import com.example.demo.entities.Tema;
import com.example.demo.entities.Usuario;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.UnauthorizedException;
import com.example.demo.repositories.ComentarioRepository;
import com.example.demo.services.user.UsuarioService;
import com.example.demo.utils.dto.ComentarioRequest;
import com.example.demo.utils.dto.ComentarioResponse;
import com.example.demo.utils.dto.UsuarioResponse;

@Service
public class ComentarioService {
    
    @Autowired
    private ComentarioRepository comentarioRepository;
    
    @Autowired
    private TemaService temaService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Transactional
    public ComentarioResponse crearComentario(ComentarioRequest request, String username) {
        Usuario autor = usuarioService.obtenerUsuarioEntity(username);
        Tema tema = temaService.obtenerTemaEntity(request.getTemaId());
        
        if (tema.isEstaBaneado()) {
            throw new RuntimeException("No puedes comentar en un tema baneado");
        }
        
        Comentario comentario = new Comentario(
            request.getContenido(),
            autor,
            tema
        );
        
        comentario = comentarioRepository.save(comentario);
        
        return convertToComentarioResponse(comentario);
    }
    
    @Transactional(readOnly = true)
    public Page<ComentarioResponse> listarComentariosPorTema(Long temaId, Pageable pageable) {
        Tema tema = temaService.obtenerTemaEntity(temaId);
        
        return comentarioRepository.findByTema(tema, pageable)
            .map(this::convertToComentarioResponse);
    }
    
    @Transactional(readOnly = true)
    public List<ComentarioResponse> listarComentariosPorUsuario(String username) {
        Usuario usuario = usuarioService.obtenerUsuarioEntity(username);
        
        return comentarioRepository.findByAutor(usuario).stream()
            .map(this::convertToComentarioResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ComentarioResponse obtenerComentarioPorId(Long id) {
        Comentario comentario = comentarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comentario no encontrado"));
        
        return convertToComentarioResponse(comentario);
    }
    
    @Transactional
    public ComentarioResponse actualizarComentario(Long id, ComentarioRequest request, String username) {
        Comentario comentario = comentarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comentario no encontrado"));
        
        Usuario autor = usuarioService.obtenerUsuarioEntity(username);
        
        if (!comentario.getAutor().getId().equals(autor.getId())) {
            throw new UnauthorizedException("No tienes permiso para editar este comentario");
        }
        
        if (comentario.isEstaBaneado()) {
            throw new RuntimeException("No puedes editar un comentario baneado");
        }
        
        comentario.setContenido(request.getContenido());
        comentario.setUltimaActualizacion(LocalDateTime.now());
        
        comentario = comentarioRepository.save(comentario);
        
        return convertToComentarioResponse(comentario);
    }
    
    @Transactional
    public void eliminarComentario(Long id, String username) {
        Comentario comentario = comentarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comentario no encontrado"));
        
        Usuario usuario = usuarioService.obtenerUsuarioEntity(username);
        
        if (!comentario.getAutor().getId().equals(usuario.getId()) && 
            usuario.getRol() != Usuario.Rol.ADMINISTRADOR) {
            throw new UnauthorizedException("No tienes permiso para eliminar este comentario");
        }
        
        comentarioRepository.delete(comentario);
    }
    
    @Transactional(readOnly = true)
    public Comentario obtenerComentarioEntity(Long id) {
        return comentarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comentario no encontrado"));
    }
    
    public ComentarioResponse convertToComentarioResponse(Comentario comentario) {
        UsuarioResponse autorResponse = new UsuarioResponse(
            comentario.getAutor().getId(),
            comentario.getAutor().getNombre(),
            comentario.getAutor().getUsername(),
            comentario.getAutor().getEmail(),
            comentario.getAutor().getRol().toString(),
            comentario.getAutor().isEstaActivo(),
            comentario.getAutor().getFechaRegistro()
        );
        
        return new ComentarioResponse(
            comentario.getId(),
            comentario.getContenido(),
            comentario.getFechaCreacion(),
            comentario.getUltimaActualizacion(),
            autorResponse,
            comentario.getTema().getId(),
            comentario.isEstaBaneado(),
            comentario.getRazonBaneo()
        );
    }
}