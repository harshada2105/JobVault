package com.jobvault.dto.application;

import com.jobvault.enums.ApplicationStatus;
import com.jobvault.enums.EmploymentType;
import com.jobvault.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record JobApplicationRequest(
        @NotNull(message = "Company is required")
        Long companyId,

        @NotBlank(message = "Job title is required")
        @Size(max = 160, message = "Job title must be 160 characters or fewer")
        String jobTitle,

        @Size(max = 255, message = "Job URL must be 255 characters or fewer")
        String jobUrl,

        @NotNull(message = "Employment type is required")
        EmploymentType employmentType,

        @Size(max = 120, message = "Location must be 120 characters or fewer")
        String location,

        @Size(max = 80, message = "Salary range must be 80 characters or fewer")
        String salaryRange,

        @NotNull(message = "Status is required")
        ApplicationStatus status,

        @NotNull(message = "Priority is required")
        Priority priority,

        LocalDate appliedDate,
        LocalDate deadlineDate,
        String notes
) {
}
