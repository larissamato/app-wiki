<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Billing;
use App\Models\Company;
use App\Models\CrmCustomer;
use App\Models\CrmOpportunity;
use App\Models\Device;
use App\Models\DiscoveryDc;
use App\Models\DiscoveryDevice;
use App\Models\DnsZone;
use App\Models\DnsRecord;
use App\Models\Entity;
use App\Models\KbArticle;
use App\Models\KbCategory;
use App\Models\Product;
use App\Models\ProductItem;
use App\Models\Sector;
use App\Models\Ticket;
use App\Models\Tier;
use App\Models\UserSectors;
use App\Models\CrmEmployee;
use App\Policies\BillingPolicy;
use App\Policies\CompanyPolicy;
use App\Policies\CrmOpportunityPolicy;
use App\Policies\DevicePolicy;
use App\Policies\DiscoveryDcPolicy;
use App\Policies\DiscoveryDevicePolicy;
use App\Policies\DnsZonePolicy;
use App\Policies\DnsRecordPolicy;
use App\Policies\EntityPolicy;
use App\Policies\ProductPolicy;
use App\Policies\ProductItemPolicy;
use App\Policies\SectorPolicy;
use App\Policies\TicketPolicy;
use App\Policies\TierPolicy;
use App\Policies\CrmCustomerPolicy;
use App\Policies\KbArticlePolicy;
use App\Policies\KbCategoryPolicy;
use App\Policies\UserSectorsPolicy;
use App\Policies\OrderPolicy;
use App\Policies\OrderTermDiscountPolicy;
use App\Policies\HrJobPolicy;
use App\Policies\CrmDefaultPolicy;
use App\Policies\TicketAutofillPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Billing::class     => BillingPolicy::class,
        Company::class     => CompanyPolicy::class,
        Device::class      => DevicePolicy::class,
        DiscoveryDevice::class  =>  DiscoveryDevicePolicy::class,
        DiscoveryDc::class  =>  DiscoveryDcPolicy::class,
        DnsZone::class     => DnsZonePolicy::class,
        DnsRecord::class   => DnsRecordPolicy::class,
        Entity::class      => EntityPolicy::class,
        Product::class     => ProductPolicy::class,
        ProductItem::class => ProductItemPolicy::class,
        Sector::class      => SectorPolicy::class,
        Ticket::class      => TicketPolicy::class,
        Tier::class        => TierPolicy::class,
        CrmOpportunity::class => CrmOpportunityPolicy::class,
        CrmCustomer::class => CrmCustomerPolicy::class,
        KbArticle::class   =>  KbArticlePolicy::class,
        KbCategory::class  =>  KbCategoryPolicy::class,
        UserSectors::class =>  UserSectorsPolicy::class,
        Order::class       =>  OrderPolicy::class,
        OrderTermDiscount::class =>  OrderTermDiscountPolicy::class,
        HrJob::class         => HrJobPolicy::class,
        CrmEmployee::class   => CrmDefaultPolicy::class,
        TicketAutofill::class      => TicketAutofillPolicy::class
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot(): void
    {
        //
    }
}
