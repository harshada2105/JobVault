package com.jobvault.repository;

import com.jobvault.entity.JobApplication;
import com.jobvault.enums.ApplicationStatus;
import com.jobvault.enums.Priority;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ApplicationStatus status);

    long countByUserIdAndPriority(Long userId, Priority priority);

    boolean existsByCompanyIdAndUserId(Long companyId, Long userId);

    List<JobApplication> findTop5ByUserIdOrderByUpdatedAtDesc(Long userId);

    @Query("""
            select a from JobApplication a
            join fetch a.company c
            where a.user.id = :userId
              and (:status is null or a.status = :status)
              and (:priority is null or a.priority = :priority)
              and (:companyId is null or c.id = :companyId)
              and (:query is null or lower(a.jobTitle) like lower(concat('%', :query, '%'))
                   or lower(c.name) like lower(concat('%', :query, '%'))
                   or lower(a.location) like lower(concat('%', :query, '%'))
                   or lower(a.notes) like lower(concat('%', :query, '%')))
            order by a.updatedAt desc
            """)
    List<JobApplication> findWithFilters(
            @Param("userId") Long userId,
            @Param("status") ApplicationStatus status,
            @Param("priority") Priority priority,
            @Param("companyId") Long companyId,
            @Param("query") String query
    );
}
