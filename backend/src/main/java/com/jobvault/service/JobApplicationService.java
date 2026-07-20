package com.jobvault.service;

import com.jobvault.dto.application.JobApplicationRequest;
import com.jobvault.dto.application.JobApplicationResponse;
import com.jobvault.dto.application.StatusHistoryResponse;
import com.jobvault.dto.application.StatusUpdateRequest;
import com.jobvault.entity.ApplicationStatusHistory;
import com.jobvault.entity.Company;
import com.jobvault.entity.JobApplication;
import com.jobvault.entity.User;
import com.jobvault.enums.ApplicationStatus;
import com.jobvault.enums.Priority;
import com.jobvault.exception.ResourceNotFoundException;
import com.jobvault.repository.ApplicationStatusHistoryRepository;
import com.jobvault.repository.DocumentRepository;
import com.jobvault.repository.InterviewRepository;
import com.jobvault.repository.JobApplicationRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobApplicationService {
    private final JobApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final InterviewRepository interviewRepository;
    private final DocumentRepository documentRepository;
    private final UserService userService;
    private final CompanyService companyService;

    public JobApplicationService(
            JobApplicationRepository applicationRepository,
            ApplicationStatusHistoryRepository historyRepository,
            InterviewRepository interviewRepository,
            DocumentRepository documentRepository,
            UserService userService,
            CompanyService companyService
    ) {
        this.applicationRepository = applicationRepository;
        this.historyRepository = historyRepository;
        this.interviewRepository = interviewRepository;
        this.documentRepository = documentRepository;
        this.userService = userService;
        this.companyService = companyService;
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getAll(
            Long userId,
            ApplicationStatus status,
            Priority priority,
            Long companyId,
            String query
    ) {
        return applicationRepository.findWithFilters(userId, status, priority, companyId, normalizeQuery(query))
                .stream()
                .map(JobApplicationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobApplicationResponse getById(Long userId, Long id) {
        return JobApplicationResponse.from(getEntity(userId, id));
    }

    @Transactional(readOnly = true)
    public JobApplication getEntity(Long userId, Long id) {
        return applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found"));
    }

    @Transactional
    public JobApplicationResponse create(Long userId, JobApplicationRequest request) {
        User user = userService.getUserEntity(userId);
        Company company = companyService.getEntity(userId, request.companyId());

        JobApplication application = new JobApplication();
        application.setUser(user);
        application.setCompany(company);
        applyRequest(application, request);
        JobApplication savedApplication = applicationRepository.save(application);
        addHistory(savedApplication, null, savedApplication.getStatus(), "Application created");
        return JobApplicationResponse.from(savedApplication);
    }

    @Transactional
    public JobApplicationResponse update(Long userId, Long id, JobApplicationRequest request) {
        JobApplication application = getEntity(userId, id);
        ApplicationStatus oldStatus = application.getStatus();
        Company company = companyService.getEntity(userId, request.companyId());
        application.setCompany(company);
        applyRequest(application, request);
        JobApplication savedApplication = applicationRepository.save(application);

        if (oldStatus != savedApplication.getStatus()) {
            addHistory(savedApplication, oldStatus, savedApplication.getStatus(), "Status updated while editing application");
        }
        return JobApplicationResponse.from(savedApplication);
    }

    @Transactional
    public JobApplicationResponse updateStatus(Long userId, Long id, StatusUpdateRequest request) {
        JobApplication application = getEntity(userId, id);
        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(request.status());
        JobApplication savedApplication = applicationRepository.save(application);
        if (oldStatus != request.status()) {
            addHistory(savedApplication, oldStatus, request.status(), blankToNull(request.note()));
        }
        return JobApplicationResponse.from(savedApplication);
    }

    @Transactional
    public void delete(Long userId, Long id) {
        JobApplication application = getEntity(userId, id);
        interviewRepository.deleteByApplicationIdAndUserId(id, userId);
        documentRepository.deleteByApplicationIdAndUserId(id, userId);
        historyRepository.deleteByApplicationIdAndApplicationUserId(id, userId);
        applicationRepository.delete(application);
    }

    @Transactional(readOnly = true)
    public List<StatusHistoryResponse> getHistory(Long userId, Long applicationId) {
        getEntity(userId, applicationId);
        return historyRepository.findByApplicationIdAndApplicationUserIdOrderByChangedAtDesc(applicationId, userId)
                .stream()
                .map(StatusHistoryResponse::from)
                .toList();
    }

    private void applyRequest(JobApplication application, JobApplicationRequest request) {
        application.setJobTitle(request.jobTitle().trim());
        application.setJobUrl(blankToNull(request.jobUrl()));
        application.setEmploymentType(request.employmentType());
        application.setLocation(blankToNull(request.location()));
        application.setSalaryRange(blankToNull(request.salaryRange()));
        application.setStatus(request.status());
        application.setPriority(request.priority());
        application.setAppliedDate(request.appliedDate());
        application.setDeadlineDate(request.deadlineDate());
        application.setNotes(blankToNull(request.notes()));
    }

    private void addHistory(JobApplication application, ApplicationStatus oldStatus, ApplicationStatus newStatus, String note) {
        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(application);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setNote(note);
        historyRepository.save(history);
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private String normalizeQuery(String query) {
        return query == null || query.trim().isEmpty() ? null : query.trim();
    }
}
