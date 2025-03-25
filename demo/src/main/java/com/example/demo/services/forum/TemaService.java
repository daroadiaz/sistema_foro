package com.example.demo.services.forum;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Categoria;
import com.example.demo.entities.Tema;
import com.example.demo.entities.Usuario;
import com.example.demo.repositories.TemaRepository;
import com.example.demo.services.user.UsuarioService;
import com.example.demo.utils.dto.TemaRequest;
import com.example.demo.utils.dto.TemaResponse;
import com.example.demo.utils.dto.UsuarioResponse;

@Service
public class TemaService {
    
    @Autowired
    private TemaRepository temaRepository;
    
    @Autowired
    private CategoriaService categoriaService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    public TemaResponse crearTema(TemaRequest request, String username) {
        Usuario autor = usuarioService.obtenerUsuarioEntity(username);
        Categoria categoria = categoriaService.obtenerCategoriaPorId(request.getCategoriaId());
        
        Tema tema = new Tema(
            request.getTitulo(),
            request.getContenido(),
            autor,
            categoria
        );
        
        tema = temaRepository.save(tema);
        
        return convertToTemaResponse(tema);
    }
    
    public List<TemaResponse> listarTemasPorCategoria(Long categoriaId) {
        Categoria categoria = categoriaService.obtenerCategoriaPorId(categoriaId);
        
        return temaRepository.findByCategoria(categoria).stream()
            .filter(tema -> !tema.isEstaBaneado())
            .map(this::convertToTemaResponse)
            .collect(Collectors.toList());
    }
    
    public Page<TemaResponse> listarTemasPorCategoriaPaginados(Long categoriaId, Pageable pageable) {
        Categoria categoria = categoriaService.obtenerCategoriaPorId(categoriaId);
        
        return temaRepository.findByCategoria(categoria, pageable)
            .map(this::convertToTemaResponse);
    }
    
    public Page<TemaResponse> buscarTemasPorTitulo(String titulo, Pageable pageable) {
        return temaRepository.findByTituloContainingIgnoreCase(titulo, pageable)
            .map(this::convertToTemaResponse);
    }
    
    public TemaResponse obtenerTemaPorId(Long id) {
        Tema tema = temaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tema no encontrado"));
        
        return convertToTemaResponse(tema);
    }
    
    public TemaResponse actualizarTema(Long id, TemaRequest request, String username) {
        Tema tema = temaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tema no encontrado"));
        
        Usuario autor = usuarioService.obtenerUsuarioEntity(username);
        
        if (!tema.getAutor().getId().equals(autor.getId())) {
            throw new RuntimeException("No tienes permiso para editar este tema");
        }
        
        if (tema.isEstaBaneado()) {
            throw new RuntimeException("No puedes editar un tema baneado");
        }
        
        tema.setTitulo(request.getTitulo());
        tema.setContenido(request.getContenido());
        tema.setUltimaActualizacion(LocalDateTime.now());
        
        if (!tema.getCategoria().getId().equals(request.getCategoriaId())) {
            Categoria categoria = categoriaService.obtenerCategoriaPorId(request.getCategoriaId());
            tema.setCategoria(categoria);
        }
        
        tema = temaRepository.save(tema);
        
        return convertToTemaResponse(tema);
    }
    
    public void eliminarTema(Long id, String username) {
        Tema tema = temaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tema no encontrado"));
        
        Usuario usuario = usuarioService.obtenerUsuarioEntity(username);
        
        if (!tema.getAutor().getId().equals(usuario.getId()) && 
            usuario.getRol() != Usuario.Rol.ADMINISTRADOR) {
            throw new RuntimeException("No tienes permiso para eliminar este tema");
        }
        
        temaRepository.delete(tema);
    }
    
    public List<TemaResponse> listarTemasPorUsuario(String username) {
        Usuario usuario = usuarioService.obtenerUsuarioEntity(username);
        
        return temaRepository.findByAutor(usuario).stream()
            .map(this::convertToTemaResponse)
            .collect(Collectors.toList());
    }
    
    public Tema obtenerTemaEntity(Long id) {
        return temaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tema no encontrado"));
    }
    
    private TemaResponse convertToTemaResponse(Tema tema) {
        UsuarioResponse autorResponse = new UsuarioResponse(
            tema.getAutor().getId(),
            tema.getAutor().getNombre(),
            tema.getAutor().getUsername(),
            tema.getAutor().getEmail(),
            tema.getAutor().getRol().toString()
        );
        
        return new TemaResponse(
            tema.getId(),
            tema.getTitulo(),
            tema.getContenido(),
            tema.getFechaCreacion(),
            tema.getUltimaActualizacion(),
            autorResponse,
            tema.getCategoria().getNombre(),
            tema.isEstaBaneado(),
            tema.getRazonBaneo()
        );
    }
}