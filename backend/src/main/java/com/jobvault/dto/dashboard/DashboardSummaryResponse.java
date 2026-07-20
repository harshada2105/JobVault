package com.jobvault.dto.dashboard;

import com.jobvault.dto.application.JobApplicationResponse;
import com.jobvault.dto.interview.InterviewResponse;
import java.util.List;

public record DashboardSummaryResponse(
        long totalApplications,
        long totalCompanies,
        long totalInterviews,
        long totalContacts,
        long totalDocuments,
        long offers,
        long rejected,
        long upcomingInterviews,
        List<StatusCountResponse> applicationStatusCounts,
        List<JobApplicationResponse> recentApplications,
        List<InterviewResponse> upcomingInterviewList
) {
}
