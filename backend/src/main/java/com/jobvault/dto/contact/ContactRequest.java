package com.jobvault.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotNull(message = "Company is required")
        Long companyId,

        @NotBlank(message = "Contact name is required")
        @Size(max = 120, message = "Name must be 120 characters or fewer")
        String name,

        @Email(message = "Enter a valid email address")
        @Size(max = 150, message = "Email must be 150 characters or fewer")
        String email,

        @Size(max = 30, message = "Phone must be 30 characters or fewer")
        String phone,

        @Size(max = 120, message = "Role must be 120 characters or fewer")
        String roleTitle,

        @Size(max = 255, message = "LinkedIn URL must be 255 characters or fewer")
        String linkedinUrl,

        String notes
) {
}
