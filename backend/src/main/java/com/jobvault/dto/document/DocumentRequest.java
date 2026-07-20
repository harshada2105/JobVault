package com.jobvault.dto.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DocumentRequest(
        Long applicationId,

        @NotBlank(message = "Document name is required")
        @Size(max = 150, message = "Document name must be 150 characters or fewer")
        String documentName,

        @NotBlank(message = "Document type is required")
        @Size(max = 60, message = "Document type must be 60 characters or fewer")
        String documentType,

        @NotBlank(message = "File URL is required")
        @Size(max = 255, message = "File URL must be 255 characters or fewer")
        String fileUrl
) {
}
