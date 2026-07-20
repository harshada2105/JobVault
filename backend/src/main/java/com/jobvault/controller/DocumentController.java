package com.jobvault.controller;

import com.jobvault.dto.common.MessageResponse;
import com.jobvault.dto.document.DocumentRequest;
import com.jobvault.dto.document.DocumentResponse;
import com.jobvault.security.UserPrincipal;
import com.jobvault.service.DocumentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getDocuments(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(documentService.getAll(currentUser.getId()));
    }

    @PostMapping
    public ResponseEntity<DocumentResponse> createDocument(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DocumentRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.create(currentUser.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteDocument(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        documentService.delete(currentUser.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Document deleted successfully"));
    }
}
