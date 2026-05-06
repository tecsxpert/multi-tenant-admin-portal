package com.internship.tool.config;

import com.internship.tool.entity.Tenant;
import com.internship.tool.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TenantRepository tenantRepository;

    @Override
    public void run(String... args) {
        if (tenantRepository.count() == 0) {
            seedTenants();
        }
    }

    private void seedTenants() {
        List<Tenant> demoTenants = Arrays.asList(
            createTenant("Acme Corp", "General manufacturing and research", "ACTIVE"),
            createTenant("Globex Corporation", "High-tech weapon systems and software", "ACTIVE"),
            createTenant("Soylent Corp", "Food processing and distribution", "SUSPENDED"),
            createTenant("Initech", "Software consultancy and TPS reports", "ACTIVE"),
            createTenant("Umbrella Corp", "Pharmaceuticals and bio-engineering", "INACTIVE"),
            createTenant("Stark Industries", "Clean energy and defense tech", "ACTIVE"),
            createTenant("Wayne Enterprises", "Diversified international conglomerate", "ACTIVE"),
            createTenant("Cyberdyne Systems", "Artificial intelligence and robotics", "ACTIVE"),
            createTenant("Hooli", "Belson-led tech giant", "ACTIVE"),
            createTenant("Pied Piper", "Compression algorithm startup", "ACTIVE"),
            createTenant("Vandelay Industries", "Latex manufacturing and import/export", "ACTIVE"),
            createTenant("Dunder Mifflin", "Mid-size paper supply company", "ACTIVE"),
            createTenant("E Corp", "Massive financial and consumer goods", "SUSPENDED"),
            createTenant("Aperture Science", "Experimental research and portal tech", "ACTIVE"),
            createTenant("Black Mesa", "Anomalous materials research", "ACTIVE")
        );
        tenantRepository.saveAll(demoTenants);
        System.out.println(">> Seeded 15 realistic tenant records.");
    }

    private Tenant createTenant(String name, String desc, String status) {
        return Tenant.builder()
                .name(name)
                .description(desc)
                .status(status)
                .createdAt(LocalDateTime.now().minusDays((long) (Math.random() * 30)))
                .build();
    }
}
