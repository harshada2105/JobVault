package com.jobvault.repository;

import com.jobvault.entity.Company;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByUserIdOrderByNameAsc(Long userId);

    Optional<Company> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    @Query("""
            select c from Company c
            where c.user.id = :userId
              and (:query is null or lower(c.name) like lower(concat('%', :query, '%'))
                   or lower(c.location) like lower(concat('%', :query, '%'))
                   or lower(c.notes) like lower(concat('%', :query, '%')))
            order by c.name asc
            """)
    List<Company> search(@Param("userId") Long userId, @Param("query") String query);
}
