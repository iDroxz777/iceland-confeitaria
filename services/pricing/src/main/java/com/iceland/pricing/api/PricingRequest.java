package com.iceland.pricing.api;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PricingRequest(
    @Min(0) Long priceCents,
    @NotNull UnitType unit,
    @NotNull @DecimalMin("0.5") @DecimalMax("30.0") Double quantity,
    @NotNull FulfillmentType fulfillment
) {
    public enum UnitType { kg, unidade, cento, caixa, combo }
    public enum FulfillmentType { pickup, delivery }
}
