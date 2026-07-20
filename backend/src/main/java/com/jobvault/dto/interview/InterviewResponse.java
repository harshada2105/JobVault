package com.jobvault.dto.interview;

import com.jobvault.entity.Interview;
import java.time.LocalDateTime;

public record InterviewResponse(
        Long id,
        Long applicationId,
        String jobTitle,
        String companyName,
        String interviewType,
        LocalDateTime scheduledAt,
        String interviewerName,
        String meetingLink,
        String location,
        String status,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static InterviewResponse from(Interview interview) {
        return new InterviewResponse(
                interview.getId(),
                interview.getApplication().getId(),
                interview.getApplication().getJobTitle(),
                interview.getApplication().getCompany().getName(),
                interview.getInterviewType().name(),
                interview.getScheduledAt(),
                interview.getInterviewerName(),
                interview.getMeetingLink(),
                interview.getLocation(),
                interview.getStatus().name(),
                interview.getNotes(),
                interview.getCreatedAt(),
                interview.getUpdatedAt()
        );
    }
}
