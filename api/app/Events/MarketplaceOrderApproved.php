<?php

namespace App\Events;

use App\Models\MarketplaceOrder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MarketplaceOrderApproved
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public MarketplaceOrder $order,
    ) {
    }
}
