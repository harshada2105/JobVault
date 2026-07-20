package com.jobvault.dto.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompanyRequest(
        @NotBlank(message = "Company name is required")
        @Size(max = 150, message = "Company name must be 150 characters or fewer")
        String name,

        @Size(max = 255, message = "Website must be 255 characters or fewer")
        String website,

        @Size(max = 120, message = "Location must be 120 characters or fewer")
        String location,

        String notes
) {
}
