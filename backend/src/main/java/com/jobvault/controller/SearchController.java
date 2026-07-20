package com.jobvault.controller;

import com.jobvault.dto.search.SearchResponse;
import com.jobvault.security.UserPrincipal;
import com.jobvault.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<SearchResponse> search(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String query
    ) {
        return ResponseEntity.ok(searchService.search(currentUser.getId(), query));
    }
}
