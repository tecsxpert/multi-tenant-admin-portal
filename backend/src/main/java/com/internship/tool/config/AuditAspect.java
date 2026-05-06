package com.internship.tool.config;

import com.internship.tool.dto.TenantDTO;
import com.internship.tool.entity.AuditLog;
import com.internship.tool.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @Pointcut("execution(* com.internship.tool.service.TenantService.createTenant(..))")
    public void createTenant() {}

    @Pointcut("execution(* com.internship.tool.service.TenantService.updateTenant(..))")
    public void updateTenant() {}

    @Pointcut("execution(* com.internship.tool.service.TenantService.deleteTenant(..))")
    public void deleteTenant() {}

    @AfterReturning(pointcut = "createTenant()", returning = "result")
    public void logCreateTenant(JoinPoint joinPoint, Object result) {
        saveLog("CREATE", (TenantDTO) result);
    }

    @AfterReturning(pointcut = "updateTenant()", returning = "result")
    public void logUpdateTenant(JoinPoint joinPoint, Object result) {
        saveLog("UPDATE", (TenantDTO) result);
    }

    @AfterReturning(pointcut = "deleteTenant()")
    public void logDeleteTenant(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        Long id = (Long) args[0];
        saveLog("DELETE", id);
    }

    private void saveLog(String action, TenantDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AuditLog log = AuditLog.builder()
                .action(action)
                .entityName("Tenant")
                .entityId(dto.getId())
                .performedBy(username)
                .details("Tenant name: " + dto.getName())
                .build();
        auditLogRepository.save(log);
    }

    private void saveLog(String action, Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AuditLog log = AuditLog.builder()
                .action(action)
                .entityName("Tenant")
                .entityId(id)
                .performedBy(username)
                .details("Soft deleted tenant with ID: " + id)
                .build();
        auditLogRepository.save(log);
    }
}
