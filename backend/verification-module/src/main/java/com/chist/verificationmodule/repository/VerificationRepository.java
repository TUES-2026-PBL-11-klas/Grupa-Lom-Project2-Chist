package com.chist.verificationmodule.repository;

import com.chist.verificationmodule.model.Verification;
import com.chist.verificationmodule.model.VerificationStatus;
import com.chist.verificationmodule.model.VerificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface VerificationRepository  extends JpaRepository<Verification, UUID> {
    List<Verification> findByIdTaskId(UUID id);
    Optional<Verification> findByTaskIdAndType(UUID taskId, VerificationType type);
    List<Verification> findByStatus(VerificationStatus status);
}
