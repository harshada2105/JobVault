package com.jobvault.service;

import com.jobvault.dto.document.DocumentRequest;
import com.jobvault.dto.document.DocumentResponse;
import com.jobvault.entity.Document;
import com.jobvault.entity.JobApplication;
import com.jobvault.entity.User;
import com.jobvault.exception.ResourceNotFoundException;
import com.jobvault.repository.DocumentRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserService userService;
    private final JobApplicationService applicationService;

    public DocumentService(DocumentRepository documentRepository, UserService userService, JobApplicationService applicationService) {
        this.documentRepository = documentRepository;
        this.userService = userService;
        this.applicationService = applicationService;
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getAll(Long userId) {
        return documentRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(DocumentResponse::from)
                .toList();
    }

    @Transactional
    public DocumentResponse create(Long userId, DocumentRequest request) {
        User user = userService.getUserEntity(userId);
        Document document = new Document();
        document.setUser(user);
        if (request.applicationId() != null) {
            JobApplication application = applicationService.getEntity(userId, request.applicationId());
            document.setApplication(application);
        }
        document.setDocumentName(request.documentName().trim());
        document.setDocumentType(request.documentType().trim());
        document.setFileUrl(request.fileUrl().trim());
        return DocumentResponse.from(documentRepository.save(document));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        documentRepository.delete(getEntity(userId, id));
    }

    @Transactional(readOnly = true)
    public Document getEntity(Long userId, Long id) {
        return documentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }
}
