package com.jobvault.service;

import com.jobvault.dto.interview.InterviewRequest;
import com.jobvault.dto.interview.InterviewResponse;
import com.jobvault.dto.interview.InterviewStatusUpdateRequest;
import com.jobvault.entity.Interview;
import com.jobvault.entity.JobApplication;
import com.jobvault.entity.User;
import com.jobvault.enums.InterviewStatus;
import com.jobvault.exception.ResourceNotFoundException;
import com.jobvault.repository.InterviewRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InterviewService {
    private final InterviewRepository interviewRepository;
    private final UserService userService;
    private final JobApplicationService applicationService;

    public InterviewService(
            InterviewRepository interviewRepository,
            UserService userService,
            JobApplicationService applicationService
    ) {
        this.interviewRepository = interviewRepository;
        this.userService = userService;
        this.applicationService = applicationService;
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getAll(Long userId, InterviewStatus status, String query) {
        return interviewRepository.findWithFilters(userId, status, normalizeQuery(query))
                .stream()
                .map(InterviewResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public InterviewResponse getById(Long userId, Long id) {
        return InterviewResponse.from(getEntity(userId, id));
    }

    @Transactional
    public InterviewResponse create(Long userId, InterviewRequest request) {
        User user = userService.getUserEntity(userId);
        JobApplication application = applicationService.getEntity(userId, request.applicationId());
        Interview interview = new Interview();
        interview.setUser(user);
        interview.setApplication(application);
        applyRequest(interview, request);
        return InterviewResponse.from(interviewRepository.save(interview));
    }

    @Transactional
    public InterviewResponse update(Long userId, Long id, InterviewRequest request) {
        Interview interview = getEntity(userId, id);
        JobApplication application = applicationService.getEntity(userId, request.applicationId());
        interview.setApplication(application);
        applyRequest(interview, request);
        return InterviewResponse.from(interviewRepository.save(interview));
    }

    @Transactional
    public InterviewResponse updateStatus(Long userId, Long id, InterviewStatusUpdateRequest request) {
        Interview interview = getEntity(userId, id);
        interview.setStatus(request.status());
        return InterviewResponse.from(interviewRepository.save(interview));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        interviewRepository.delete(getEntity(userId, id));
    }

    @Transactional(readOnly = true)
    public Interview getEntity(Long userId, Long id) {
        return interviewRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
    }

    private void applyRequest(Interview interview, InterviewRequest request) {
        interview.setInterviewType(request.interviewType());
        interview.setScheduledAt(request.scheduledAt());
        interview.setInterviewerName(blankToNull(request.interviewerName()));
        interview.setMeetingLink(blankToNull(request.meetingLink()));
        interview.setLocation(blankToNull(request.location()));
        interview.setStatus(request.status());
        interview.setNotes(blankToNull(request.notes()));
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private String normalizeQuery(String query) {
        return query == null || query.trim().isEmpty() ? null : query.trim();
    }
}
