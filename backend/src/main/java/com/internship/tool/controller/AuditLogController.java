package com.internship.tool.controller;

import com.internship.tool.entity.AuditLog;
import com.internship.tool.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(auditLogRepository.findAll(pageRequest));
    }
}
