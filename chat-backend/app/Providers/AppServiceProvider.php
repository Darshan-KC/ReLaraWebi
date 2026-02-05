<?php

namespace App\Providers;

use App\Models\Message;
use App\Models\MessageReaction;
use App\Policies\MessagePolicy;
use App\Policies\MessageReactionPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        $this->registerPolicies();
    }

    /**
     * Register authorization policies
     */
    protected function registerPolicies(): void
    {
        \Illuminate\Support\Facades\Gate::policy(Message::class, MessagePolicy::class);
        \Illuminate\Support\Facades\Gate::policy(MessageReaction::class, MessageReactionPolicy::class);
    }
}
