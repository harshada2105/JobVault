package com.jobvault.controller;

import com.jobvault.dto.common.MessageResponse;
import com.jobvault.dto.contact.ContactRequest;
import com.jobvault.dto.contact.ContactResponse;
import com.jobvault.security.UserPrincipal;
import com.jobvault.service.ContactService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getContacts(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String query
    ) {
        return ResponseEntity.ok(contactService.getAll(currentUser.getId(), query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContact(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        return ResponseEntity.ok(contactService.getById(currentUser.getId(), id));
    }

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ContactRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.create(currentUser.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request
    ) {
        return ResponseEntity.ok(contactService.update(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteContact(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        contactService.delete(currentUser.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Contact deleted successfully"));
    }
}
