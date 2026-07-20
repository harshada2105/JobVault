package com.jobvault.dto.document;

import com.jobvault.entity.Document;
import java.time.LocalDateTime;

public record DocumentResponse(
        Long id,
        Long applicationId,
        String jobTitle,
        String documentName,
        String documentType,
        String fileUrl,
        LocalDateTime createdAt
) {
    public static DocumentResponse from(Document document) {
        return new DocumentResponse(
                document.getId(),
                document.getApplication() == null ? null : document.getApplication().getId(),
                document.getApplication() == null ? null : document.getApplication().getJobTitle(),
                document.getDocumentName(),
                document.getDocumentType(),
                document.getFileUrl(),
                document.getCreatedAt()
        );
    }
}
