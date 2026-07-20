package com.jobvault.repository;

import com.jobvault.entity.Interview;
import com.jobvault.enums.InterviewStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Optional<Interview> findByIdAndUserId(Long id, Long userId);

    List<Interview> findByUserIdOrderByScheduledAtAsc(Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, InterviewStatus status);

    boolean existsByApplicationIdAndUserId(Long applicationId, Long userId);

    void deleteByApplicationIdAndUserId(Long applicationId, Long userId);

    @Query("""
            select i from Interview i
            join fetch i.application a
            join fetch a.company
            where i.user.id = :userId
              and i.scheduledAt >= :fromDate
              and i.status = :status
            order by i.scheduledAt asc
            """)
    List<Interview> findUpcoming(
            @Param("userId") Long userId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("status") InterviewStatus status
    );

    @Query("""
            select i from Interview i
            join fetch i.application a
            join fetch a.company c
            where i.user.id = :userId
              and (:status is null or i.status = :status)
              and (:query is null or lower(i.interviewerName) like lower(concat('%', :query, '%'))
                   or lower(a.jobTitle) like lower(concat('%', :query, '%'))
                   or lower(c.name) like lower(concat('%', :query, '%'))
                   or lower(i.location) like lower(concat('%', :query, '%')))
            order by i.scheduledAt asc
            """)
    List<Interview> findWithFilters(
            @Param("userId") Long userId,
            @Param("status") InterviewStatus status,
            @Param("query") String query
    );
}
