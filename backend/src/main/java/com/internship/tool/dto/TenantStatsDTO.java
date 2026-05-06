package com.internship.tool.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class TenantStatsDTO {
    private long totalTenants;
    private long activeTenants;
    private long suspendedTenants;
    private long deletedTenants;
    private Map<String, Long> statusDistribution;
}
