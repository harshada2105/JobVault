package com.jobvault.dto.interview;

import com.jobvault.enums.InterviewStatus;
import com.jobvault.enums.InterviewType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record InterviewRequest(
        @NotNull(message = "Application is required")
        Long applicationId,

        @NotNull(message = "Interview type is required")
        InterviewType interviewType,

        @NotNull(message = "Scheduled date and time are required")
        LocalDateTime scheduledAt,

        @Size(max = 120, message = "Interviewer name must be 120 characters or fewer")
        String interviewerName,

        @Size(max = 255, message = "Meeting link must be 255 characters or fewer")
        String meetingLink,

        @Size(max = 120, message = "Location must be 120 characters or fewer")
        String location,

        @NotNull(message = "Status is required")
        InterviewStatus status,

        String notes
) {
}
