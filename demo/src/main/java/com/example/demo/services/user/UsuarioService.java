package com.example.demo.services.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Usuario;
import com.example.demo.entities.Usuario.Rol;
import com.example.demo.repositories.UsuarioRepository;
import com.example.demo.utils.dto.RegistroRequest;
import com.example.demo.utils.dto.UsuarioResponse;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public UsuarioResponse registrarUsuario(RegistroRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }
        
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está en uso");
        }
        
        Usuario usuario = new Usuario(
            request.getNombre(),
            request.getUsername(),
            request.getEmail(),
            request.getPassword(), // En una aplicación real, deberías encriptar la contraseña
            Rol.USUARIO
        );
        
        usuario = usuarioRepository.save(usuario);
        
        return convertToUsuarioResponse(usuario);
    }
    
    public UsuarioResponse registrarAdministrador(RegistroRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }
        
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está en uso");
        }
        
        Usuario usuario = new Usuario(
            request.getNombre(),
            request.getUsername(),
            request.getEmail(),
            request.getPassword(), // En una aplicación real, deberías encriptar la contraseña
            Rol.ADMINISTRADOR
        );
        
        usuario = usuarioRepository.save(usuario);
        
        return convertToUsuarioResponse(usuario);
    }
    
    public UsuarioResponse obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return convertToUsuarioResponse(usuario);
    }
    
    public UsuarioResponse obtenerUsuarioPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return convertToUsuarioResponse(usuario);
    }
    
    public boolean autenticarUsuario(String username, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // En una aplicación real, deberías verificar la contraseña encriptada
            return usuario.getPassword().equals(password) && usuario.isEstaActivo();
        }
        
        return false;
    }
    
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll().stream()
            .map(this::convertToUsuarioResponse)
            .collect(Collectors.toList());
    }
    
    public UsuarioResponse actualizarUsuario(Long id, RegistroRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!usuario.getUsername().equals(request.getUsername()) &&
            usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }
        
        if (!usuario.getEmail().equals(request.getEmail()) &&
            usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está en uso");
        }
        
        usuario.setNombre(request.getNombre());
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            usuario.setPassword(request.getPassword()); // En una aplicación real, encriptar la contraseña
        }
        
        usuario = usuarioRepository.save(usuario);
        
        return convertToUsuarioResponse(usuario);
    }
    
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        usuarioRepository.deleteById(id);
    }
    
    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setEstaActivo(false);
        usuarioRepository.save(usuario);
    }
    
    public void activarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setEstaActivo(true);
        usuarioRepository.save(usuario);
    }
    
    public Usuario obtenerUsuarioEntity(String username) {
        return usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    public Usuario obtenerUsuarioEntityPorId(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    private UsuarioResponse convertToUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getUsername(),
            usuario.getEmail(),
            usuario.getRol().toString()
        );
    }
}