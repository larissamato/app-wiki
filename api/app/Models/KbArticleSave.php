<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KbArticleSave extends Model
{
    use HasFactory;

    protected $fillable = [
        'kb_article_id',
        'user_id',
        'updated_at'
    ];

    protected $hidden = [
        'id',
        'kb_article_id',
        'user_id',
    ];

    protected $with = [
        'user',
        'article'
    ];

    public function article()
    {
        return $this->belongsTo(KbArticle::class, 'kb_article_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
