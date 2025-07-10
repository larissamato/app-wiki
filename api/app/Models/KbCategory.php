<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KbCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_parent_id',
        'name',
        'slug'
    ];

    protected $with = [
        'parent',
    ];

    protected $hidden = [
        'id',
        'category_parent_id',
        'articles',
        'children',
        'pivot'
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function children(): HasMany
    {
        return $this->hasMany(KbCategory::class, 'category_parent_id', $this->id)
            ->without(['parent']);
    }

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(KbArticle::class, 'kb_article_categories', 'kb_category_id', 'kb_article_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(KbCategory::class, 'category_parent_id')
            ->without(['children']);
    }
}
