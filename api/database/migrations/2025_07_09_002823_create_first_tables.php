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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique()->index();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->integer('level')->default(1);
            $table->longText('avatar')->nullable();
            $table->boolean('can_receive_emails')->default(true);
            $table->rememberToken();
            $table->string('token')->nullable();
            $table->string('firstlogin_token')->nullable();
            $table->string('authcode')->nullable();
            $table->timestamp('authcode_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('kb_articles', function (Blueprint $table) {
            $table->id();
            $table->longText('name')->unique();
            $table->longText('slug');
            $table->longText('content');
            $table->boolean('is_private')->default(true);
            $table->bigInteger('created_by');
            $table->bigInteger('updated_by')->nullable();
            $table->bigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('kb_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_parent_id')->nullable();
            $table->string('name');
            $table->string('slug');
            $table->timestamps();
        });

        Schema::create('kb_article_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kb_article_id');
            $table->foreignId('kb_category_id');
            $table->timestamps();
        });

        Schema::create('kb_article_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('kb_article_id');
            $table->boolean('vote');
            $table->timestamps();
        });

        Schema::create('kb_article_saves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('kb_article_id');
            $table->timestamps();
        });

        Schema::create('logs', function(Blueprint $table) {
            $table->id();
            $table->string('mode');
            $table->string('table');
            $table->bigInteger('item_id')->nullable();
            $table->longText('old_value')->nullable();
            $table->longText('new_value')->nullable();
            $table->bigInteger('created_by')->nullable();
            $table->timestamps();
        });

        Schema::create('user_loginhistories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('ip')->nullable();
            $table->string('useragent')->nullable();
            $table->timestamps();
        });


        Schema::create('app_configs', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index()->unique();
            $table->longText('value')->nullable();
            $table->bigInteger('created_by')->nullable();
            $table->bigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email')->index();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('kb_articles');
        Schema::dropIfExists('kb_article_categories');
        Schema::dropIfExists('kb_categories');
        Schema::dropIfExists('kb_article_votes');
        Schema::dropIfExists('kb_article_saves');
        Schema::dropIfExists('logs');
        Schema::dropIfExists('configs');
        Schema::dropIfExists('user_loginhistories');
        Schema::dropIfExists('password_resets');
    }
};
