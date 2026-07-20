package com.jobvault.dto.dashboard;

import java.util.List;

public record StatisticsResponse(
        List<StatusCountResponse> applicationsByStatus,
        List<StatusCountResponse> applicationsByPriority,
        List<StatusCountResponse> interviewsByStatus
) {
}
