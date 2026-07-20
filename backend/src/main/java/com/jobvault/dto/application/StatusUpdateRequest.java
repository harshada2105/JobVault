package com.jobvault.dto.application;

import com.jobvault.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
        @NotNull(message = "Status is required")
        ApplicationStatus status,

        String note
) {
}
