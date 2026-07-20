package com.jobvault.dto.search;

import com.jobvault.dto.application.JobApplicationResponse;
import com.jobvault.dto.company.CompanyResponse;
import com.jobvault.dto.contact.ContactResponse;
import com.jobvault.dto.interview.InterviewResponse;
import java.util.List;

public record SearchResponse(
        String query,
        List<CompanyResponse> companies,
        List<JobApplicationResponse> applications,
        List<InterviewResponse> interviews,
        List<ContactResponse> contacts
) {
}
