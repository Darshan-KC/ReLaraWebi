<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add columns to messages table for pinning and editing
        Schema::table('messages', function (Blueprint $table) {
            $table->boolean('is_pinned')->default(false)->index();
            $table->unsignedBigInteger('pinned_by')->nullable()->after('is_pinned');
            $table->timestamp('pinned_at')->nullable()->after('pinned_by');
            $table->integer('edit_count')->default(0);
        });

        // Create message pins table for history
        Schema::create('message_pins', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('message_id');
            $table->unsignedBigInteger('conversation_id');
            $table->unsignedBigInteger('pinned_by');
            $table->timestamps();
            
            $table->foreign('message_id')->references('id')->on('messages')->onDelete('cascade');
            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->foreign('pinned_by')->references('id')->on('users')->onDelete('cascade');
            
            $table->index(['conversation_id', 'created_at']);
        });

        // Create typing indicators table
        Schema::create('typing_indicators', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('conversation_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('expires_at');
            $table->timestamps();
            
            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->unique(['conversation_id', 'user_id']);
            $table->index('expires_at');
        });

        // Create message edits history table
        Schema::create('message_edits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('message_id');
            $table->text('original_body');
            $table->text('edited_body');
            $table->unsignedBigInteger('edited_by');
            $table->timestamps();
            
            $table->foreign('message_id')->references('id')->on('messages')->onDelete('cascade');
            $table->foreign('edited_by')->references('id')->on('users')->onDelete('set null');
            
            $table->index(['message_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_edits');
        Schema::dropIfExists('typing_indicators');
        Schema::dropIfExists('message_pins');
        
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['is_pinned', 'pinned_by', 'pinned_at', 'edit_count']);
        });
    }
};
