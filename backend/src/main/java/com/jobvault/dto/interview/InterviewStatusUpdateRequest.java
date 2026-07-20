package com.jobvault.dto.interview;

import com.jobvault.enums.InterviewStatus;
import jakarta.validation.constraints.NotNull;

public record InterviewStatusUpdateRequest(
        @NotNull(message = "Status is required")
        InterviewStatus status
) {
}
