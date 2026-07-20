package com.jobvault.service;

import com.jobvault.dto.profile.ProfileResponse;
import com.jobvault.dto.profile.ProfileUpdateRequest;
import com.jobvault.entity.User;
import com.jobvault.exception.BadRequestException;
import com.jobvault.exception.ResourceNotFoundException;
import com.jobvault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long userId) {
        return ProfileResponse.from(getUserEntity(userId));
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = getUserEntity(userId);
        userRepository.findByEmail(request.email().trim().toLowerCase())
                .filter(existing -> !existing.getId().equals(userId))
                .ifPresent(existing -> {
                    throw new BadRequestException("Email is already in use");
                });

        user.setName(request.name().trim());
        user.setEmail(request.email().trim().toLowerCase());
        return ProfileResponse.from(userRepository.save(user));
    }
}
