package com.jobvault.repository;

import com.jobvault.entity.Contact;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    Optional<Contact> findByIdAndUserId(Long id, Long userId);

    List<Contact> findByUserIdOrderByNameAsc(Long userId);

    long countByUserId(Long userId);

    boolean existsByCompanyIdAndUserId(Long companyId, Long userId);

    @Query("""
            select c from Contact c
            join fetch c.company company
            where c.user.id = :userId
              and (:query is null or lower(c.name) like lower(concat('%', :query, '%'))
                   or lower(c.email) like lower(concat('%', :query, '%'))
                   or lower(c.roleTitle) like lower(concat('%', :query, '%'))
                   or lower(company.name) like lower(concat('%', :query, '%')))
            order by c.name asc
            """)
    List<Contact> search(@Param("userId") Long userId, @Param("query") String query);
}
