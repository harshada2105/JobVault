package com.jobvault.dto.contact;

import com.jobvault.entity.Contact;
import java.time.LocalDateTime;

public record ContactResponse(
        Long id,
        Long companyId,
        String companyName,
        String name,
        String email,
        String phone,
        String roleTitle,
        String linkedinUrl,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ContactResponse from(Contact contact) {
        return new ContactResponse(
                contact.getId(),
                contact.getCompany().getId(),
                contact.getCompany().getName(),
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getRoleTitle(),
                contact.getLinkedinUrl(),
                contact.getNotes(),
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }
}
