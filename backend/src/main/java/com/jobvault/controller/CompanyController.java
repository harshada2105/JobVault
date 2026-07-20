package com.jobvault.controller;

import com.jobvault.dto.common.MessageResponse;
import com.jobvault.dto.company.CompanyRequest;
import com.jobvault.dto.company.CompanyResponse;
import com.jobvault.security.UserPrincipal;
import com.jobvault.service.CompanyService;
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
@RequestMapping("/api/companies")
public class CompanyController {
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getCompanies(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String query
    ) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(companyService.getAll(currentUser.getId()));
        }
        return ResponseEntity.ok(companyService.search(currentUser.getId(), query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompany(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        return ResponseEntity.ok(companyService.getById(currentUser.getId(), id));
    }

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CompanyRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.create(currentUser.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody CompanyRequest request
    ) {
        return ResponseEntity.ok(companyService.update(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCompany(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long id) {
        companyService.delete(currentUser.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Company deleted successfully"));
    }
}
