<?php

namespace App\Providers;

use App\Models\Message;
use App\Models\MessageReaction;
use App\Policies\MessagePolicy;
use App\Policies\MessageReactionPolicy;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

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
        
        // Configure rate limiting
        $this->configureRateLimiting();
    }

    /**
     * Register authorization policies
     */
    protected function registerPolicies(): void
    {
        \Illuminate\Support\Facades\Gate::policy(Message::class, MessagePolicy::class);
        \Illuminate\Support\Facades\Gate::policy(MessageReaction::class, MessageReactionPolicy::class);
    }

    /**
     * Configure rate limiting for API endpoints
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('reaction-create', function (Request $request) {
            return Limit::perMinute(30)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message' => 'Too many reaction requests. Please try again later.',
                        'retry_after' => $headers['Retry-After'] ?? 60,
                    ], 429, $headers);
                });
        });
    }
}

