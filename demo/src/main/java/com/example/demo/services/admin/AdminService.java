package com.example.demo.services.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Comentario;
import com.example.demo.entities.Tema;
import com.example.demo.entities.Usuario;
import com.example.demo.repositories.ComentarioRepository;
import com.example.demo.repositories.TemaRepository;
import com.example.demo.services.forum.ComentarioService;
import com.example.demo.services.forum.TemaService;
import com.example.demo.services.user.UsuarioService;
import com.example.demo.utils.dto.BanRequest;
import com.example.demo.utils.dto.ComentarioResponse;
import com.example.demo.utils.dto.TemaResponse;

@Service
public class AdminService {
    
    @Autowired
    private TemaRepository temaRepository;
    
    @Autowired
    private ComentarioRepository comentarioRepository;
    
    @Autowired
    private TemaService temaService;
    
    @Autowired
    private ComentarioService comentarioService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    public TemaResponse banearTema(Long temaId, BanRequest request, String adminUsername) {
        Tema tema = temaService.obtenerTemaEntity(temaId);
        Usuario admin = usuarioService.obtenerUsuarioEntity(adminUsername);
        
        if (admin.getRol() != Usuario.Rol.ADMINISTRADOR) {
            throw new RuntimeException("No tienes permisos de administrador");
        }
        
        tema.setEstaBaneado(true);
        tema.setRazonBaneo(request.getRazonBaneo());
        
        tema = temaRepository.save(tema);
        
        return temaService.obtenerTemaPorId(tema.getId());
    }
    
    public TemaResponse desbanearTema(Long temaId, String adminUsername) {
        Tema tema = temaService.obtenerTemaEntity(temaId);
        Usuario admin = usuarioService.obtenerUsuarioEntity(adminUsername);
        
        if (admin.getRol() != Usuario.Rol.ADMINISTRADOR) {
            throw new RuntimeException("No tienes permisos de administrador");
        }
        
        tema.setEstaBaneado(false);
        tema.setRazonBaneo(null);
        
        tema = temaRepository.save(tema);
        
        return temaService.obtenerTemaPorId(tema.getId());
    }
    
    public ComentarioResponse banearComentario(Long comentarioId, BanRequest request, String adminUsername) {
        Comentario comentario = comentarioService.obtenerComentarioEntity(comentarioId);
        Usuario admin = usuarioService.obtenerUsuarioEntity(adminUsername);
        
        if (admin.getRol() != Usuario.Rol.ADMINISTRADOR) {
            throw new RuntimeException("No tienes permisos de administrador");
        }
        
        comentario.setEstaBaneado(true);
        comentario.setRazonBaneo(request.getRazonBaneo());
        
        comentario = comentarioRepository.save(comentario);
        
        return comentarioService.obtenerComentarioPorId(comentario.getId());
    }
    
    public ComentarioResponse desbanearComentario(Long comentarioId, String adminUsername) {
        Comentario comentario = comentarioService.obtenerComentarioEntity(comentarioId);
        Usuario admin = usuarioService.obtenerUsuarioEntity(adminUsername);
        
        if (admin.getRol() != Usuario.Rol.ADMINISTRADOR) {
            throw new RuntimeException("No tienes permisos de administrador");
        }
        
        comentario.setEstaBaneado(false);
        comentario.setRazonBaneo(null);
        
        comentario = comentarioRepository.save(comentario);
        
        return comentarioService.obtenerComentarioPorId(comentario.getId());
    }
    
    public Page<TemaResponse> listarTemasBaneados(Pageable pageable, String adminUsername) {
        Usuario admin = usuarioService.obtenerUsuarioEntity(adminUsername);
        
        if (admin.getRol() != Usuario.Rol.ADMINISTRADOR) {
            throw new RuntimeException("No tienes permisos de administrador");
        }
        
        return temaRepository.findByEstaBaneado(true, pageable)
            .map(tema -> temaService.obtenerTemaPorId(tema.getId()));
    }
    
    public Page<ComentarioResponse> listarComentariosBaneados(Pageable pageable, String adminUsername) {
        Usuario admin = usuarioService.obtenerUsuarioEntity(adminUsername);
        
        if (admin.getRol() != Usuario.Rol.ADMINISTRADOR) {
            throw new RuntimeException("No tienes permisos de administrador");
        }
        
        return comentarioRepository.findByEstaBaneado(true, pageable)
            .map(comentario -> comentarioService.obtenerComentarioPorId(comentario.getId()));
    }
}