package com.jobvault.controller;

import com.jobvault.dto.dashboard.DashboardSummaryResponse;
import com.jobvault.dto.dashboard.StatisticsResponse;
import com.jobvault.security.UserPrincipal;
import com.jobvault.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(dashboardService.getSummary(currentUser.getId()));
    }

    @GetMapping("/statistics")
    public ResponseEntity<StatisticsResponse> getStatistics(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(dashboardService.getStatistics(currentUser.getId()));
    }
}
