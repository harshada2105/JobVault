package com.jobvault.service;

import com.jobvault.dto.company.CompanyRequest;
import com.jobvault.dto.company.CompanyResponse;
import com.jobvault.entity.Company;
import com.jobvault.entity.User;
import com.jobvault.exception.BadRequestException;
import com.jobvault.exception.ResourceNotFoundException;
import com.jobvault.repository.CompanyRepository;
import com.jobvault.repository.ContactRepository;
import com.jobvault.repository.JobApplicationRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final UserService userService;
    private final JobApplicationRepository applicationRepository;
    private final ContactRepository contactRepository;

    public CompanyService(
            CompanyRepository companyRepository,
            UserService userService,
            JobApplicationRepository applicationRepository,
            ContactRepository contactRepository
    ) {
        this.companyRepository = companyRepository;
        this.userService = userService;
        this.applicationRepository = applicationRepository;
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public List<CompanyResponse> getAll(Long userId) {
        return companyRepository.findByUserIdOrderByNameAsc(userId)
                .stream()
                .map(CompanyResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CompanyResponse getById(Long userId, Long id) {
        return CompanyResponse.from(getEntity(userId, id));
    }

    @Transactional(readOnly = true)
    public Company getEntity(Long userId, Long id) {
        return companyRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
    }

    @Transactional
    public CompanyResponse create(Long userId, CompanyRequest request) {
        User user = userService.getUserEntity(userId);
        Company company = new Company();
        company.setUser(user);
        applyRequest(company, request);
        return CompanyResponse.from(companyRepository.save(company));
    }

    @Transactional
    public CompanyResponse update(Long userId, Long id, CompanyRequest request) {
        Company company = getEntity(userId, id);
        applyRequest(company, request);
        return CompanyResponse.from(companyRepository.save(company));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        Company company = getEntity(userId, id);
        if (applicationRepository.existsByCompanyIdAndUserId(id, userId)) {
            throw new BadRequestException("Delete related job applications before deleting this company");
        }
        if (contactRepository.existsByCompanyIdAndUserId(id, userId)) {
            throw new BadRequestException("Delete related contacts before deleting this company");
        }
        companyRepository.delete(company);
    }

    @Transactional(readOnly = true)
    public List<CompanyResponse> search(Long userId, String query) {
        String preparedQuery = normalizeQuery(query);
        return companyRepository.search(userId, preparedQuery)
                .stream()
                .map(CompanyResponse::from)
                .toList();
    }

    private void applyRequest(Company company, CompanyRequest request) {
        company.setName(request.name().trim());
        company.setWebsite(blankToNull(request.website()));
        company.setLocation(blankToNull(request.location()));
        company.setNotes(blankToNull(request.notes()));
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private String normalizeQuery(String query) {
        return query == null || query.trim().isEmpty() ? null : query.trim();
    }
}
