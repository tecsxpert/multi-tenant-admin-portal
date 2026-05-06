package com.internship.tool.controller;

import com.internship.tool.service.AiServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiServiceClient aiServiceClient;

    @PostMapping("/describe")
    public ResponseEntity<Map<String, Object>> describeTenant(@RequestBody Map<String, String> request) {
        String input = request.get("input");
        String aiResponse = aiServiceClient.callDescribe(input);
        
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("result", aiResponse);
        
        return ResponseEntity.ok(response);
    }
}
