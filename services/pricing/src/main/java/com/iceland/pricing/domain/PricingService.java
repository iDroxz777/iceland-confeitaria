package com.iceland.pricing.domain;

import com.iceland.pricing.api.PricingRequest;
import com.iceland.pricing.api.PricingResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PricingService {
    private final long deliveryFeeCents;

    public PricingService(@Value("${iceland.delivery-fee-cents}") long deliveryFeeCents) {
        if (deliveryFeeCents < 0) throw new IllegalArgumentException("A taxa de entrega não pode ser negativa.");
        this.deliveryFeeCents = deliveryFeeCents;
    }

    public PricingResponse estimate(PricingRequest request) {
        long fee = request.fulfillment() == PricingRequest.FulfillmentType.delivery ? deliveryFeeCents : 0;
        if (request.priceCents() == null) return new PricingResponse(null, fee, null);

        double multiplier = request.unit() == PricingRequest.UnitType.kg ? request.quantity() : 1;
        long subtotal = Math.round(request.priceCents() * multiplier);
        return new PricingResponse(subtotal, fee, subtotal + fee);
    }
}
