<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KbArticleVote extends Model
{
    use HasFactory;

    protected $casts = [
        'vote' => 'boolean'
    ];

    protected $fillable = [
        'user_id',
        'kb_article_id',
        'vote'
    ];

    protected $hidden = [
        'kb_article_id',
        'user_id',
        'id',
    ];

    protected $with = [
        'article',
    ];

    public function article()
    {
        return $this->belongsTo(KbArticle::class, 'kb_article_id')->withTrashed();
    }
}
