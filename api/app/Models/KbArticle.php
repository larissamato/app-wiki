<?php

namespace App\Models;

use App\Traits\UserStamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\KbCategory;
use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class KbArticle extends Model
{
    use HasFactory, SoftDeletes, UserStamps, Loggable;

    protected $casts = [
        'is_private' => 'boolean',
    ];

    protected $fillable = [
        'slug',
        'name',
        'content',
        'is_private',
        'updated_at',
        'created_at',
    ];

    protected $with = [
        'categories',
    ];

    protected $hidden = [
        'id'
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(KbCategory::class, 'kb_article_categories', 'kb_article_id', 'kb_category_id')
            ->with(['parent']);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(KbArticleVote::class);
    }

    public function saves(): HasMany
    {
        return $this->hasMany(KbArticleSave::class);
    }
}
