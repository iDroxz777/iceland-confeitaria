package com.iceland.pricing.api;

import com.iceland.pricing.domain.PricingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {
    private final PricingService service;

    public PricingController(PricingService service) {
        this.service = service;
    }

    @PostMapping("/estimate")
    public ResponseEntity<PricingResponse> estimate(@Valid @RequestBody PricingRequest request) {
        return ResponseEntity.ok(service.estimate(request));
    }
}
