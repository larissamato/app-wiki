<?php

namespace App\Models;

use Carbon\Traits\Timestamp;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KbArticleCategory extends Model
{
    use HasFactory, Timestamp;

    protected $fillable = [
        'kb_article_id',
        'kb_category_id',
    ];

    protected $hidden = [
        'id',
        'kb_article_id',
        'kb_category_id',
    ];

    public function article()
    {
        return $this->belongsTo(KbArticle::class);
    }

    public function articles()
    {
        return $this->hasMany(KbArticle::class);
    }
    public function category()
    {
        return $this->belongsTo(KbCategory::class);
    }

    public function categories()
    {
        return $this->hasMany(KbCategory::class);
    }
}
