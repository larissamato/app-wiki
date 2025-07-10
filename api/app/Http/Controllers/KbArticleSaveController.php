<?php

namespace App\Http\Controllers;

use App\Http\Resources\GenericArrayCollection;
use App\Models\KbArticle;
use App\Models\KbArticleSave;
use Illuminate\Http\Request;

class KbArticleSaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): GenericArrayCollection
    {
        $save = new KbArticleSave();
        $save = $save
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');
        return new GenericArrayCollection($save->paginate($request->get('perPage') ?? 15));
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, KbArticle $article): KbArticleSave
    {
        return KbArticleSave::create([
            'user_id' => $request->user()->id,
            'kb_article_id' => $article->id
        ])->refresh();
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, KbArticle $article): void
    {
        KbArticleSave::where('kb_article_id', $article->id)->where('user_id', $request->user()->id)->first()->delete();
    }
}
