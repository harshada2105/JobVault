package com.jobvault.service;

import com.jobvault.dto.application.JobApplicationResponse;
import com.jobvault.dto.dashboard.DashboardSummaryResponse;
import com.jobvault.dto.dashboard.StatisticsResponse;
import com.jobvault.dto.dashboard.StatusCountResponse;
import com.jobvault.dto.interview.InterviewResponse;
import com.jobvault.enums.ApplicationStatus;
import com.jobvault.enums.InterviewStatus;
import com.jobvault.enums.Priority;
import com.jobvault.repository.CompanyRepository;
import com.jobvault.repository.ContactRepository;
import com.jobvault.repository.DocumentRepository;
import com.jobvault.repository.InterviewRepository;
import com.jobvault.repository.JobApplicationRepository;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {
    private final JobApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;
    private final InterviewRepository interviewRepository;
    private final ContactRepository contactRepository;
    private final DocumentRepository documentRepository;

    public DashboardService(
            JobApplicationRepository applicationRepository,
            CompanyRepository companyRepository,
            InterviewRepository interviewRepository,
            ContactRepository contactRepository,
            DocumentRepository documentRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.companyRepository = companyRepository;
        this.interviewRepository = interviewRepository;
        this.contactRepository = contactRepository;
        this.documentRepository = documentRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(Long userId) {
        List<InterviewResponse> upcomingInterviews = interviewRepository
                .findUpcoming(userId, LocalDateTime.now(), InterviewStatus.SCHEDULED)
                .stream()
                .limit(5)
                .map(InterviewResponse::from)
                .toList();

        return new DashboardSummaryResponse(
                applicationRepository.countByUserId(userId),
                companyRepository.countByUserId(userId),
                interviewRepository.countByUserId(userId),
                contactRepository.countByUserId(userId),
                documentRepository.countByUserId(userId),
                applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.OFFER),
                applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED),
                upcomingInterviews.size(),
                applicationStatusCounts(userId),
                applicationRepository.findTop5ByUserIdOrderByUpdatedAtDesc(userId)
                        .stream()
                        .map(JobApplicationResponse::from)
                        .toList(),
                upcomingInterviews
        );
    }

    @Transactional(readOnly = true)
    public StatisticsResponse getStatistics(Long userId) {
        return new StatisticsResponse(
                applicationStatusCounts(userId),
                Arrays.stream(Priority.values())
                        .map(priority -> new StatusCountResponse(priority.name(), applicationRepository.countByUserIdAndPriority(userId, priority)))
                        .toList(),
                Arrays.stream(InterviewStatus.values())
                        .map(status -> new StatusCountResponse(status.name(), interviewRepository.countByUserIdAndStatus(userId, status)))
                        .toList()
        );
    }

    private List<StatusCountResponse> applicationStatusCounts(Long userId) {
        return Arrays.stream(ApplicationStatus.values())
                .map(status -> new StatusCountResponse(status.name(), applicationRepository.countByUserIdAndStatus(userId, status)))
                .toList();
    }
}
