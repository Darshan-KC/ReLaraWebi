<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get users blocked by this user
     */
    public function blockedUsers()
    {
        return $this->hasMany(BlockedUser::class, 'user_id');
    }

    /**
     * Get users who have blocked this user
     */
    public function blockedByUsers()
    {
        return $this->hasMany(BlockedUser::class, 'blocked_user_id');
    }

    /**
     * Check if this user has blocked another user
     */
    public function hasBlocked(User $user): bool
    {
        return $this->blockedUsers()
            ->where('blocked_user_id', $user->id)
            ->exists();
    }

    /**
     * Check if this user has been blocked by another user
     */
    public function isBlockedBy(User $user): bool
    {
        return $this->blockedByUsers()
            ->where('user_id', $user->id)
            ->exists();
    }
}
