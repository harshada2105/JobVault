package com.jobvault.repository;

import com.jobvault.entity.Document;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    Optional<Document> findByIdAndUserId(Long id, Long userId);

    List<Document> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);

    boolean existsByApplicationIdAndUserId(Long applicationId, Long userId);

    void deleteByApplicationIdAndUserId(Long applicationId, Long userId);
}
