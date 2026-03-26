package com.chist.userservice.controller;

import com.chist.userservice.dto.UserResponse;
import com.chist.userservice.model.User;
import com.chist.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;


import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(mapToDTO(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        return ResponseEntity.ok(mapToDTO(user));
    }


    private UserResponse mapToDTO(User user){
        return UserResponse.builder()
                .id(user.getUuid())
                .email(user.getEmail())
                .username(user.getUsername())
                .points(user.getPoints())
                .streak(user.getStreak())
                .role(user.getClass().getSimpleName())
                .createdAt(user.getCreated_at())
                .updatedAt(user.getUpdated_at())
                .build();
    }




}
