package com.jobvault.repository;

import com.jobvault.entity.ApplicationStatusHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, Long> {
    List<ApplicationStatusHistory> findByApplicationIdAndApplicationUserIdOrderByChangedAtDesc(Long applicationId, Long userId);

    void deleteByApplicationIdAndApplicationUserId(Long applicationId, Long userId);
}
