package com.iceland.pricing.api;

public record PricingResponse(Long subtotalCents, long deliveryFeeCents, Long totalCents) {}
