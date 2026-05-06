package com.internship.tool.service;

import com.internship.tool.dto.TenantDTO;
import com.internship.tool.dto.TenantStatsDTO;
import com.internship.tool.entity.AuditLog;
import com.internship.tool.entity.Tenant;
import com.internship.tool.exception.BadRequestException;
import com.internship.tool.exception.NotFoundException;
import com.internship.tool.repository.AuditLogRepository;
import com.internship.tool.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;

import com.opencsv.CSVWriter;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public TenantDTO createTenant(TenantDTO tenantDTO) {
        if (tenantRepository.findByName(tenantDTO.getName()).isPresent()) {
            throw new BadRequestException("Tenant with name " + tenantDTO.getName() + " already exists");
        }

        Tenant tenant = Tenant.builder()
                .name(tenantDTO.getName())
                .description(tenantDTO.getDescription())
                .status(tenantDTO.getStatus())
                .build();

        Tenant savedTenant = tenantRepository.save(tenant);

        // CREATE AUDIT LOG
        auditLogRepository.save(AuditLog.builder()
                .action("NODE_PROVISIONED")
                .entityName("TENANT")
                .entityId(savedTenant.getId())
                .performedBy("SYSTEM_ADMIN")
                .details("New node initialized: " + savedTenant.getName())
                .build());

        return mapToDTO(savedTenant);
    }

    public Page<TenantDTO> getAllTenants(Pageable pageable) {
        return tenantRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Cacheable(value = "tenants", key = "#id")
    public TenantDTO getTenantById(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tenant not found with id: " + id));
        return mapToDTO(tenant);
    }

    @Transactional
    @CachePut(value = "tenants", key = "#id")
    public TenantDTO updateTenant(Long id, TenantDTO tenantDTO) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tenant not found with id: " + id));

        tenant.setName(tenantDTO.getName());
        tenant.setDescription(tenantDTO.getDescription());
        tenant.setStatus(tenantDTO.getStatus());

        Tenant updatedTenant = tenantRepository.save(tenant);

        // CREATE AUDIT LOG
        auditLogRepository.save(AuditLog.builder()
                .action("NODE_OPTIMIZED")
                .entityName("TENANT")
                .entityId(updatedTenant.getId())
                .performedBy("SYSTEM_ADMIN")
                .details("Protocol updated for node: " + updatedTenant.getName())
                .build());

        return mapToDTO(updatedTenant);
    }

    @Transactional
    @CacheEvict(value = "tenants", key = "#id")
    public void deleteTenant(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tenant not found with id: " + id));
        
        // Soft delete
        tenant.setStatus("DELETED");
        Tenant deletedTenant = tenantRepository.save(tenant);

        // CREATE AUDIT LOG
        auditLogRepository.save(AuditLog.builder()
                .action("ISOLATION_PROTOCOL")
                .entityName("TENANT")
                .entityId(deletedTenant.getId())
                .performedBy("SYSTEM_ADMIN")
                .details("Node isolated and archived: " + deletedTenant.getName())
                .build());
    }

    public Page<TenantDTO> searchTenants(String query, Pageable pageable) {
        return tenantRepository.findByNameContainingIgnoreCase(query, pageable)
                .map(this::mapToDTO);
    }

    public TenantStatsDTO getStats() {
        List<Tenant> allTenants = tenantRepository.findAll();
        
        Map<String, Long> distribution = allTenants.stream()
                .collect(Collectors.groupingBy(Tenant::getStatus, Collectors.counting()));

        return TenantStatsDTO.builder()
                .totalTenants(allTenants.size())
                .activeTenants(distribution.getOrDefault("ACTIVE", 0L))
                .suspendedTenants(distribution.getOrDefault("SUSPENDED", 0L))
                .deletedTenants(distribution.getOrDefault("DELETED", 0L))
                .statusDistribution(distribution)
                .build();
    }

    public void exportTenantsToCSV(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=tenants.csv");

        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(response.getOutputStream()))) {
            String[] header = {"ID", "Name", "Status", "Created At"};
            writer.writeNext(header);

            List<Tenant> tenants = tenantRepository.findAll();
            for (Tenant tenant : tenants) {
                String[] data = {
                    tenant.getId().toString(),
                    tenant.getName(),
                    tenant.getStatus(),
                    tenant.getCreatedAt().toString()
                };
                writer.writeNext(data);
            }
        }
    }

    public List<Map<String, Object>> getAnalytics() {
        List<Tenant> allTenants = tenantRepository.findAll();
        
        // Group by date and count
        return allTenants.stream()
            .collect(Collectors.groupingBy(
                t -> t.getCreatedAt().toLocalDate().toString(),
                Collectors.counting()
            ))
            .entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .map(entry -> {
                Map<String, Object> map = new HashMap<>();
                map.put("date", entry.getKey());
                map.put("count", entry.getValue());
                return map;
            })
            .collect(Collectors.toList());
    }

    private TenantDTO mapToDTO(Tenant tenant) {
        return TenantDTO.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .description(tenant.getDescription())
                .status(tenant.getStatus())
                .createdAt(tenant.getCreatedAt())
                .updatedAt(tenant.getUpdatedAt())
                .build();
    }
}
