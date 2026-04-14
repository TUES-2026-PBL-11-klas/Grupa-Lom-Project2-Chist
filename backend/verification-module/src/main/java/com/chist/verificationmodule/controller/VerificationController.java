package com.chist.verificationmodule.controller;

import com.chist.verificationmodule.dto.VerificationRequest;
import com.chist.verificationmodule.dto.VerificationResponse;
import com.chist.verificationmodule.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/verifications")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping
    public ResponseEntity<VerificationResponse> verify(@RequestBody VerificationRequest request) {
        return ResponseEntity.ok(verificationService.verify(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VerificationResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(verificationService.getById(id));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<VerificationResponse>> getByTaskId(@PathVariable UUID taskId) {
        return ResponseEntity.ok(verificationService.getByTaskId(taskId));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<VerificationResponse> adminApprove(@PathVariable UUID id) {
        return ResponseEntity.ok(verificationService.adminApprove(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<VerificationResponse> adminReject(@PathVariable UUID id) {
        return ResponseEntity.ok(verificationService.adminReject(id));
    }
}