package com.jobvault.controller;

import com.jobvault.dto.application.JobApplicationRequest;
import com.jobvault.dto.application.JobApplicationResponse;
import com.jobvault.dto.application.StatusHistoryResponse;
import com.jobvault.dto.application.StatusUpdateRequest;
import com.jobvault.dto.common.MessageResponse;
import com.jobvault.enums.ApplicationStatus;
import com.jobvault.enums.Priority;
import com.jobvault.security.UserPrincipal;
import com.jobvault.service.JobApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {
    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<JobApplicationResponse>> getApplications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String query
    ) {
        return ResponseEntity.ok(applicationService.getAll(currentUser.getId(), status, priority, companyId, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getApplication(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getById(currentUser.getId(), id));
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> createApplication(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody JobApplicationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.create(currentUser.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> updateApplication(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest request
    ) {
        return ResponseEntity.ok(applicationService.update(currentUser.getId(), id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationResponse> updateStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        return ResponseEntity.ok(applicationService.updateStatus(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteApplication(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        applicationService.delete(currentUser.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Application deleted successfully"));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<StatusHistoryResponse>> getHistory(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getHistory(currentUser.getId(), id));
    }
}
