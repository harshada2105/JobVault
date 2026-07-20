package com.jobvault.service;

import com.jobvault.dto.application.JobApplicationResponse;
import com.jobvault.dto.company.CompanyResponse;
import com.jobvault.dto.contact.ContactResponse;
import com.jobvault.dto.interview.InterviewResponse;
import com.jobvault.dto.search.SearchResponse;
import com.jobvault.repository.CompanyRepository;
import com.jobvault.repository.ContactRepository;
import com.jobvault.repository.InterviewRepository;
import com.jobvault.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchService {
    private final CompanyRepository companyRepository;
    private final JobApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final ContactRepository contactRepository;

    public SearchService(
            CompanyRepository companyRepository,
            JobApplicationRepository applicationRepository,
            InterviewRepository interviewRepository,
            ContactRepository contactRepository
    ) {
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public SearchResponse search(Long userId, String query) {
        String preparedQuery = query == null || query.trim().isEmpty() ? null : query.trim();
        return new SearchResponse(
                preparedQuery == null ? "" : preparedQuery,
                companyRepository.search(userId, preparedQuery).stream().map(CompanyResponse::from).toList(),
                applicationRepository.findWithFilters(userId, null, null, null, preparedQuery).stream().map(JobApplicationResponse::from).toList(),
                interviewRepository.findWithFilters(userId, null, preparedQuery).stream().map(InterviewResponse::from).toList(),
                contactRepository.search(userId, preparedQuery).stream().map(ContactResponse::from).toList()
        );
    }
}
