package com.jobvault.dto.company;

import com.jobvault.entity.Company;
import java.time.LocalDateTime;

public record CompanyResponse(
        Long id,
        String name,
        String website,
        String location,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CompanyResponse from(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getWebsite(),
                company.getLocation(),
                company.getNotes(),
                company.getCreatedAt(),
                company.getUpdatedAt()
        );
    }
}
