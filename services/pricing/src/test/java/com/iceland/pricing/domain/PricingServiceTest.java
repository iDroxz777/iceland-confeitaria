package com.iceland.pricing.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.iceland.pricing.api.PricingRequest;
import org.junit.jupiter.api.Test;

class PricingServiceTest {
    private final PricingService service = new PricingService(1500);

    @Test
    void calculatesCakeWithDelivery() {
        var request = new PricingRequest(7900L, PricingRequest.UnitType.kg, 2.0, PricingRequest.FulfillmentType.delivery);
        var result = service.estimate(request);
        assertThat(result.subtotalCents()).isEqualTo(15800L);
        assertThat(result.deliveryFeeCents()).isEqualTo(1500L);
        assertThat(result.totalCents()).isEqualTo(17300L);
    }

    @Test
    void keepsUnknownPriceAsQuoteOnly() {
        var request = new PricingRequest(null, PricingRequest.UnitType.unidade, 1.0, PricingRequest.FulfillmentType.pickup);
        var result = service.estimate(request);
        assertThat(result.totalCents()).isNull();
    }
}
