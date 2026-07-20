package com.jobvault.dto.application;

import com.jobvault.entity.JobApplication;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record JobApplicationResponse(
        Long id,
        Long companyId,
        String companyName,
        String jobTitle,
        String jobUrl,
        String employmentType,
        String location,
        String salaryRange,
        String status,
        String priority,
        LocalDate appliedDate,
        LocalDate deadlineDate,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static JobApplicationResponse from(JobApplication application) {
        return new JobApplicationResponse(
                application.getId(),
                application.getCompany().getId(),
                application.getCompany().getName(),
                application.getJobTitle(),
                application.getJobUrl(),
                application.getEmploymentType().name(),
                application.getLocation(),
                application.getSalaryRange(),
                application.getStatus().name(),
                application.getPriority().name(),
                application.getAppliedDate(),
                application.getDeadlineDate(),
                application.getNotes(),
                application.getCreatedAt(),
                application.getUpdatedAt()
        );
    }
}
