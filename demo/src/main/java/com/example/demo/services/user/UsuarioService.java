package com.example.demo.services.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entities.Usuario;
import com.example.demo.entities.Usuario.Rol;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.UnauthorizedException;
import com.example.demo.repositories.UsuarioRepository;
import com.example.demo.utils.JwtUtil;
import com.example.demo.utils.dto.LoginRequest;
import com.example.demo.utils.dto.RegistroRequest;
import com.example.demo.utils.dto.UsuarioResponse;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Transactional
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
            passwordEncoder.encode(request.getPassword()),
            Rol.USUARIO
        );
        
        usuario = usuarioRepository.save(usuario);
        
        return convertToUsuarioResponse(usuario);
    }
    
    @Transactional
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
            passwordEncoder.encode(request.getPassword()),
            Rol.ADMINISTRADOR
        );
        
        usuario = usuarioRepository.save(usuario);
        
        return convertToUsuarioResponse(usuario);
    }
    
    @Transactional(readOnly = true)
    public UsuarioResponse obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        return convertToUsuarioResponse(usuario);
    }
    
    @Transactional(readOnly = true)
    public UsuarioResponse obtenerUsuarioPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        return convertToUsuarioResponse(usuario);
    }
    
    @Transactional
    public UsuarioResponse login(LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(request.getUsername());
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            
            if (!usuario.isEstaActivo()) {
                throw new UnauthorizedException("La cuenta está desactivada");
            }
            
            if (passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
                UsuarioResponse response = convertToUsuarioResponse(usuario);
                
                String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRol().toString());
                response.setToken(token);
                
                return response;
            }
        }
        
        throw new UnauthorizedException("Credenciales inválidas");
    }
    
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll().stream()
            .map(this::convertToUsuarioResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public UsuarioResponse actualizarUsuario(Long id, RegistroRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
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
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        usuario = usuarioRepository.save(usuario);
        
        return convertToUsuarioResponse(usuario);
    }
    
    @Transactional
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
        
        usuarioRepository.deleteById(id);
    }
    
    @Transactional
    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        usuario.setEstaActivo(false);
        usuarioRepository.save(usuario);
    }
    
    @Transactional
    public void activarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        usuario.setEstaActivo(true);
        usuarioRepository.save(usuario);
    }
    
    @Transactional(readOnly = true)
    public Usuario obtenerUsuarioEntity(String username) {
        return usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
    
    @Transactional(readOnly = true)
    public Usuario obtenerUsuarioEntityPorId(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
    
    @Transactional(readOnly = true)
    public boolean validarToken(String token, String username) {
        return jwtUtil.validateToken(token, username);
    }
    
    @Transactional(readOnly = true)
    public String obtenerRolDeToken(String token) {
        return jwtUtil.extractClaim(token, claims -> claims.get("rol", String.class));
    }
    
    private UsuarioResponse convertToUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getUsername(),
            usuario.getEmail(),
            usuario.getRol().toString(),
            usuario.isEstaActivo(),
            usuario.getFechaRegistro()
        );
    }
}