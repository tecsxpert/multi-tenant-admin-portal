package com.internship.tool.controller;

import com.internship.tool.dto.TenantDTO;
import com.internship.tool.dto.TenantStatsDTO;
import com.internship.tool.service.TenantService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TenantDTO> createTenant(@Valid @RequestBody TenantDTO tenantDTO) {
        return new ResponseEntity<>(tenantService.createTenant(tenantDTO), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<TenantDTO>> getAllTenants(Pageable pageable) {
        return ResponseEntity.ok(tenantService.getAllTenants(pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<TenantStatsDTO> getStats() {
        return ResponseEntity.ok(tenantService.getStats());
    }

    @GetMapping("/export")
    public void exportTenants(HttpServletResponse response) throws IOException {
        tenantService.exportTenantsToCSV(response);
    }

    @GetMapping("/analytics")
    public ResponseEntity<List<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(tenantService.getAnalytics());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<TenantDTO> getTenantById(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.getTenantById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TenantDTO> updateTenant(@PathVariable Long id, @Valid @RequestBody TenantDTO tenantDTO) {
        return ResponseEntity.ok(tenantService.updateTenant(id, tenantDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<TenantDTO>> searchTenants(@RequestParam String q, Pageable pageable) {
        return ResponseEntity.ok(tenantService.searchTenants(q, pageable));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        
        // Validation: Max 5MB
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds 5MB limit");
        }

        // Validation: Only PDF/Image
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf") && !contentType.startsWith("image/"))) {
            return ResponseEntity.badRequest().body("Only PDF and Image files are allowed");
        }

        return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
    }
}
