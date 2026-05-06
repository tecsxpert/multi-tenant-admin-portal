package com.internship.tool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.tool.dto.TenantDTO;
import com.internship.tool.dto.TenantStatsDTO;
import com.internship.tool.service.TenantService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TenantController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security for controller tests
public class TenantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TenantService tenantService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldCreateTenant() throws Exception {
        TenantDTO dto = TenantDTO.builder().name("Test Tenant").status("ACTIVE").build();
        when(tenantService.createTenant(any())).thenReturn(dto);

        mockMvc.perform(post("/api/tenants")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Tenant"));
    }

    @Test
    public void shouldGetStats() throws Exception {
        TenantStatsDTO stats = TenantStatsDTO.builder().totalTenants(10).build();
        when(tenantService.getStats()).thenReturn(stats);

        mockMvc.perform(get("/api/tenants/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTenants").value(10));
    }

    @Test
    public void shouldDeleteTenant() throws Exception {
        mockMvc.perform(delete("/api/tenants/1"))
                .andExpect(status().isNoContent());
    }
}
