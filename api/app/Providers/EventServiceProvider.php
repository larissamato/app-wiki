<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\AutoDeployRequested;
use App\Events\DeviceTypePodCreated;
use App\Events\InternalMonitoringRequested;
use App\Events\CompanyFirstAccess;
use App\Events\CompanyVerifyRequested;
use App\Events\MarketplaceOrderApproved;
use App\Events\NotificationCreated;
use App\Events\OminiChatWebhooked;
use App\Events\TicketSaved;
use App\Events\OrderSaved;
use App\Events\TicketRatingUpdated;
use App\Events\TicketUpdated;
use App\Events\UserAuthCodeCreated;
use App\Events\NectarWebhookCustomerRequested;
use App\Events\NectarWebhookOpportunityRequested;
use App\Events\NectarWebhookCommitmentRequested;
use App\Events\NectarWebhookTaskRequested;
use App\Listeners\AutoDeployDeploy;
use App\Listeners\CalcTicketHistory;
use App\Listeners\OminiChatSaveFollowup;
use App\Listeners\SendAuthCode;
use App\Listeners\SendCompanyAuthCode;
use App\Listeners\SendCompanyFirstAccess;
use App\Listeners\SendMobileNotification;
use App\Listeners\SendTicketCrm;
use App\Listeners\SyncOrderCrm;
use App\Listeners\SendTicketMessaging;
use App\Listeners\SendTicketNotification;
use App\Listeners\SendTicketRatingNotification;
use App\Listeners\StartAutoDeployPod;
use App\Listeners\StartMarketplaceOrderAction;
use App\Listeners\SyncMonitoringDevices;
use App\Listeners\SyncMonitoringProblems;
use App\Listeners\SyncNectarCustomer;
use App\Listeners\SyncNectarOpportunity;
use App\Listeners\SyncNectarCommitment;
use App\Listeners\SyncNectarTask;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        AutoDeployRequested::class => [
            AutoDeployDeploy::class,
        ],
        CompanyFirstAccess::class => [
            SendCompanyFirstAccess::class,
        ],
        CompanyVerifyRequested::class => [
            SendCompanyAuthCode::class,
        ],
        DeviceTypePodCreated::class => [
            StartAutoDeployPod::class,
        ],
        MarketplaceOrderApproved::class => [
            StartMarketplaceOrderAction::class,
        ],
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        NotificationCreated::class => [
            SendMobileNotification::class,
        ],
        OminiChatWebhooked::class => [
            OminiChatSaveFollowup::class,
        ],
        TicketSaved::class => [
            SendTicketNotification::class,
            SendTicketMessaging::class,
            SendTicketCrm::class,
        ],
        TicketRatingUpdated::class => [
            SendTicketRatingNotification::class
        ],
        TicketUpdated::class => [
            CalcTicketHistory::class
        ],
        InternalMonitoringRequested::class => [
            SyncMonitoringDevices::class,
            SyncMonitoringProblems::class
        ],
        UserAuthCodeCreated::class => [
            SendAuthCode::class
        ],
        OrderSaved::class => [
            SyncOrderCrm::class
        ],
        NectarWebhookCustomerRequested::class => [
             SyncNectarCustomer::class
        ],
        NectarWebhookOpportunityRequested::class => [
            SyncNectarOpportunity::class
        ],
        NectarWebhookTaskRequested::class => [
            SyncNectarTask::class
        ],
        NectarWebhookCommitmentRequested::class => [
            SyncNectarCommitment::class
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }
}
