<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\BackupSyncCommand;
use App\Console\Commands\BackupSyncPriorityCommand;
use App\Console\Commands\CompanyTierCalcCommand;
use App\Console\Commands\DailyBackupFailedSummary;
use App\Console\Commands\DiscoverySync;
use App\Console\Commands\HousekeeperCommand;
use App\Console\Commands\MikrotikHASyncCommand;
use App\Console\Commands\NectarSyncCommand;
use App\Console\Commands\NetboxSyncTenancyCommand;
use App\Console\Commands\PodChargerCommand;
use App\Console\Commands\TicketCalcCommand;
use App\Console\Commands\TicketCloseSolvedCommand;
use App\Console\Commands\TicketFromMail;
use App\Console\Commands\TicketRatingsCommand;
use App\Console\Commands\TicketScheduleCommand;
use App\Console\Commands\TotvsRMSyncCommand;
use App\Console\Commands\SecretsMasterPwdCommand;
use App\Console\Commands\StripeMarketplaceSyncCommand;
use App\Console\Commands\SuserSpriteCommand;
use App\Console\Commands\UserExpire;
use App\Console\Commands\VcenterSync;
use App\Console\Commands\VcenterSyncPortgroupCommand;
use App\Console\Commands\VcenterSyncRackCommand;
use App\Console\Commands\VpsChargerCommand;
use App\Console\Commands\BackupContractCommand;
use App\Console\Commands\StatusProblemCommand;
use App\Console\Commands\OrderRejectCommand;
use App\Console\Commands\PocRemoveCommand;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command(BackupSyncCommand::class)->everyThirtyMinutes()->runInBackground();
        $schedule->command(BackupSyncPriorityCommand::class)->everyTwoMinutes()
                 ->withoutOverlapping(10)->runInBackground();
        $schedule->command('cache:prune-stale-tags')->hourly();
        $schedule->command(HousekeeperCommand::class)->daily()->runInBackground();
        $schedule->command(CompanyTierCalcCommand::class)->hourly()->runInBackground();
        $schedule->command(DailyBackupFailedSummary::class)->dailyAt('06:00')->runInBackground();
        $schedule->command(DiscoverySync::class)->everyThirtyMinutes()->withoutOverlapping(20)->runInBackground();
        $schedule->command(BackupContractCommand::class)->dailyAt('09:00')->runInBackground();
        $schedule->command(MikrotikHASyncCommand::class)->everyMinute()->withoutOverlapping(15)->runInBackground();
        $schedule->command(NectarSyncCommand::class)->dailyAt('10:00')->runInBackground();
        $schedule->command(NetboxSyncTenancyCommand::class)->hourly()->runInBackground();
        $schedule->command(PodChargerCommand::class)->everyMinute()->withoutOverlapping(15)->runInBackground();
        $schedule->command(SecretsMasterPwdCommand::class)->dailyAt('09:00')->runInBackground();
        $schedule->command(StripeMarketplaceSyncCommand::class)->everyTwoHours()->runInBackground();
        $schedule->command(SuserSpriteCommand::class)->everyTwoHours()->runInBackground();
        $schedule->command(SuserSpriteCommand::class, ['--rebuild'])->dailyAt('04:00')->runInBackground();
        $schedule->command(UserExpire::class)->daily();
        $schedule->command(TicketCalcCommand::class)->hourly()->withoutOverlapping(10)->runInBackground();
        $schedule->command(TicketScheduleCommand::class)->everyMinute();
        $schedule->command(TicketFromMail::class)->everyMinute()->withoutOverlapping(20)->runInBackground();
        $schedule->command(TicketRatingsCommand::class)->everyMinute()->runInBackground();
        $schedule->command(VcenterSync::class)->everyTenMinutes()->withoutOverlapping(10)->runInBackground();
        $schedule->command(VpsChargerCommand::class)->dailyAt('22:00')->runInBackground();
        $schedule->command(TicketCloseSolvedCommand::class)->dailyAt('12:00')->runInBackground();
        $schedule->command(TotvsRMSyncCommand::class)->dailyAt('11:00')->runInBackground();
        $schedule->command(VcenterSyncRackCommand::class)->everyFifteenMinutes()
                 ->withoutOverlapping(10)->runInBackground();
        $schedule->command(VcenterSyncPortgroupCommand::class)->everyTenMinutes()
                 ->withoutOverlapping(20)->runInBackground();
        $schedule->command(StatusProblemCommand::class)->everyTenMinutes()->runInBackground();
        $schedule->command(OrderRejectCommand::class)->dailyAt('06:00')->runInBackground();
        $schedule->command(PocRemoveCommand::class)->dailyAt('07:00')->runInBackground();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
