package com.chist.userservice.service;

import com.chist.userservice.dto.AuthRequest;
import com.chist.userservice.dto.AuthResponse;
import com.chist.userservice.dto.RegisterRequest;
import com.chist.userservice.model.User;
import com.chist.userservice.repository.UserRepository;
import com.chist.userservice.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_throwsWhenEmailExists() {
        RegisterRequest request = new RegisterRequest("mail@test.com", "alice", "raw");
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_savesUserSendsNotificationAndReturnsToken() {
        RegisterRequest request = new RegisterRequest("mail@test.com", "alice", "raw");
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode("raw")).thenReturn("encoded");
        when(jwtService.generateToken(request.getEmail())).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("mail@test.com", userCaptor.getValue().getEmail());
        assertEquals("alice", userCaptor.getValue().getUsername());
        assertEquals("encoded", userCaptor.getValue().getPassword());
        verify(restTemplate).postForObject(
                contains("/api/notifications/registration?to=mail@test.com&username=alice"),
                eq(null),
                eq(String.class)
        );
        assertEquals("jwt-token", response.getToken());
    }

    @Test
    void login_authenticatesAndReturnsToken() {
        AuthRequest request = new AuthRequest("mail@test.com", "secret");
        User user = User.builder().email("mail@test.com").password("encoded").build();
        when(userRepository.findByEmail("mail@test.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken("mail@test.com")).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertEquals("jwt-token", response.getToken());
    }
}
