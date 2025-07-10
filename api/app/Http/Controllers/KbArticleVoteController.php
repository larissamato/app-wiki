<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKbArticleVoteRequest;
use App\Http\Resources\GenericArrayCollection;
use App\Models\KbArticle;
use App\Models\KbArticleVote;
use Illuminate\Http\Request;

class KbArticleVoteController extends Controller
{
    public function index(Request $request): GenericArrayCollection
    {
        $votes = new KbArticleVote();

        return new GenericArrayCollection(
            $votes->where('user_id', $request->user()->id)
                ->paginate($request->get('perPage') ?? 15)
        );
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKbArticleVoteRequest $request, KbArticle $article): KbArticleVote
    {
        $vote = KbArticleVote::where('kb_article_id', $article)
            ->where('user_id', $request->user()->id)->first();
        if (!$vote) {
            $vote = new KbArticleVote();
        }

        $vote->fill([
            'user_id' => $request->user()->id,
            'kb_article_id' => $article->id,
            'vote' => $request->vote
        ])->save();

        return $vote;
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, KbArticle $article)
    {
        KbArticleVote::where('kb_article_id', $article->id)
            ->where('user_id', $request->user()->id)
            ->first()
            ->delete();
    }
}
