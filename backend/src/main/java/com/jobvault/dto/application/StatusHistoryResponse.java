package com.jobvault.dto.application;

import com.jobvault.entity.ApplicationStatusHistory;
import java.time.LocalDateTime;

public record StatusHistoryResponse(
        Long id,
        String oldStatus,
        String newStatus,
        LocalDateTime changedAt,
        String note
) {
    public static StatusHistoryResponse from(ApplicationStatusHistory history) {
        return new StatusHistoryResponse(
                history.getId(),
                history.getOldStatus() == null ? null : history.getOldStatus().name(),
                history.getNewStatus().name(),
                history.getChangedAt(),
                history.getNote()
        );
    }
}
