package com.jobvault.controller;

import com.jobvault.dto.common.MessageResponse;
import com.jobvault.dto.interview.InterviewRequest;
import com.jobvault.dto.interview.InterviewResponse;
import com.jobvault.dto.interview.InterviewStatusUpdateRequest;
import com.jobvault.enums.InterviewStatus;
import com.jobvault.security.UserPrincipal;
import com.jobvault.service.InterviewService;
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
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getInterviews(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) InterviewStatus status,
            @RequestParam(required = false) String query
    ) {
        return ResponseEntity.ok(interviewService.getAll(currentUser.getId(), status, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterview(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getById(currentUser.getId(), id));
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> createInterview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody InterviewRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interviewService.create(currentUser.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewResponse> updateInterview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest request
    ) {
        return ResponseEntity.ok(interviewService.update(currentUser.getId(), id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> updateStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody InterviewStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(interviewService.updateStatus(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteInterview(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        interviewService.delete(currentUser.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Interview deleted successfully"));
    }
}
