package com.jobvault.service;

import com.jobvault.dto.contact.ContactRequest;
import com.jobvault.dto.contact.ContactResponse;
import com.jobvault.entity.Company;
import com.jobvault.entity.Contact;
import com.jobvault.entity.User;
import com.jobvault.exception.ResourceNotFoundException;
import com.jobvault.repository.ContactRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {
    private final ContactRepository contactRepository;
    private final UserService userService;
    private final CompanyService companyService;

    public ContactService(ContactRepository contactRepository, UserService userService, CompanyService companyService) {
        this.contactRepository = contactRepository;
        this.userService = userService;
        this.companyService = companyService;
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> getAll(Long userId, String query) {
        String preparedQuery = normalizeQuery(query);
        return contactRepository.search(userId, preparedQuery)
                .stream()
                .map(ContactResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ContactResponse getById(Long userId, Long id) {
        return ContactResponse.from(getEntity(userId, id));
    }

    @Transactional
    public ContactResponse create(Long userId, ContactRequest request) {
        User user = userService.getUserEntity(userId);
        Company company = companyService.getEntity(userId, request.companyId());
        Contact contact = new Contact();
        contact.setUser(user);
        contact.setCompany(company);
        applyRequest(contact, request);
        return ContactResponse.from(contactRepository.save(contact));
    }

    @Transactional
    public ContactResponse update(Long userId, Long id, ContactRequest request) {
        Contact contact = getEntity(userId, id);
        Company company = companyService.getEntity(userId, request.companyId());
        contact.setCompany(company);
        applyRequest(contact, request);
        return ContactResponse.from(contactRepository.save(contact));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        contactRepository.delete(getEntity(userId, id));
    }

    @Transactional(readOnly = true)
    public Contact getEntity(Long userId, Long id) {
        return contactRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    private void applyRequest(Contact contact, ContactRequest request) {
        contact.setName(request.name().trim());
        contact.setEmail(blankToNull(request.email()));
        contact.setPhone(blankToNull(request.phone()));
        contact.setRoleTitle(blankToNull(request.roleTitle()));
        contact.setLinkedinUrl(blankToNull(request.linkedinUrl()));
        contact.setNotes(blankToNull(request.notes()));
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private String normalizeQuery(String query) {
        return query == null || query.trim().isEmpty() ? null : query.trim();
    }
}
