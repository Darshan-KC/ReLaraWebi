<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\MessageReaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageReactionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Message $message;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->message = Message::factory()->create();
    }

    public function test_user_can_add_reaction_to_message(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/messages/{$this->message->id}/reactions", [
                'emoji' => '👍',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('message_reactions', [
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);
    }

    public function test_user_can_toggle_reaction(): void
    {
        MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/messages/{$this->message->id}/reactions", [
                'emoji' => '👍',
            ]);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('message_reactions', [
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);
    }

    public function test_unauthenticated_user_cannot_add_reaction(): void
    {
        $response = $this->postJson("/api/messages/{$this->message->id}/reactions", [
            'emoji' => '👍',
        ]);

        $response->assertStatus(401);
    }

    public function test_get_aggregated_reactions(): void
    {
        $user2 = User::factory()->create();
        MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);
        MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $user2->id,
            'emoji' => '👍',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/messages/{$this->message->id}/reactions");

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['emoji' => '👍', 'count' => 2]);
    }

    public function test_get_detailed_reactions(): void
    {
        MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/messages/{$this->message->id}/reactions/detailed");

        $response->assertStatus(200)
            ->assertJsonFragment(['emoji' => '👍', 'count' => 1]);
    }

    public function test_get_users_by_emoji(): void
    {
        MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/messages/{$this->message->id}/reactions/👍/users");

        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $this->user->id]);
    }

    public function test_check_if_user_has_reacted(): void
    {
        MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/messages/{$this->message->id}/reactions/👍/has-reacted");

        $response->assertStatus(200)
            ->assertJsonFragment(['has_reacted' => true]);
    }

    public function test_get_reaction_stats(): void
    {
        $user2 = User::factory()->create();
        MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);
        MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $user2->id,
            'emoji' => '❤️',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/messages/{$this->message->id}/reactions/stats");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'total_reactions' => 2,
                'unique_emojis' => 2,
                'total_users' => 2,
            ]);
    }

    public function test_user_can_delete_own_reaction(): void
    {
        $reaction = MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $this->user->id,
            'emoji' => '👍',
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/messages/{$this->message->id}/reactions/{$reaction->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('message_reactions', ['id' => $reaction->id]);
    }

    public function test_user_cannot_delete_others_reaction(): void
    {
        $user2 = User::factory()->create();
        $reaction = MessageReaction::create([
            'message_id' => $this->message->id,
            'user_id' => $user2->id,
            'emoji' => '👍',
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/messages/{$this->message->id}/reactions/{$reaction->id}");

        $response->assertStatus(403);
    }
}
