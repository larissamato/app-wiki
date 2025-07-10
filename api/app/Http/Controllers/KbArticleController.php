<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Http\Resources\GenericArrayCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\KbArticleRequest;
use App\Models\KbArticle;
use App\Models\KbArticleCategory;
use App\Models\KbArticleSave;
use App\Models\User;
use App\Models\KbArticleVote;
use App\Models\KbCategory;

class KbArticleController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(KbArticle::class, 'article');
    }

    public function postAttachment(Request $request): string
    {
        $uuid = Str::uuid();
        $content = base64_decode($request->content);
        Storage::disk('kb')->put($uuid, $content);
        return "![$request->name](/kb/attachment/$uuid)";
    }

    protected function whereArticlePrivate(Request $request, KbArticle|Builder $article): KbArticle|Builder
    {
        if ($request->user()->level === 1) {
            return $article->where([
                'is_private' => false
            ]);
        }
        return $article;
    }

    /**
     * List Kb KbArticles
     *
     * @param Request $request
     **/
    public function index(Request $request):GenericArrayCollection
    {
        $kb = $this->search($request, new KbArticle(), ['name', 'slug', 'content']);
        $kb = $kb->withCount('votes');

        if ($request->get('sort') && str_ends_with($request->sort, 'votes')) {
            $kb->orderBy('votes_count', str_starts_with($request->sort, '-') ? 'asc' : 'desc');
        }

        $kb = $this->whereArticlePrivate($request, $kb);

        if ($request->get('categories')) {
            $kb = $this->whereTableColumn($request, $kb, 'categories', [
                'table' => 'categories',
                'column' => 'slug',
                'multiple' => true
            ]);
        }

        if ($request->get('filterByVote')) {
            $kb = $kb->whereHas('votes', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });
        }

        if ($request->get('filterBySave')) {
            $kb = $kb->whereHas('saves', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });
        }

        if ($request->get('createdBy')) {
            $userId  = User::select('id')->where('uuid', $request->get('createdBy'))->firstOrFail()->id;
            $kb = $kb->where('created_by', $userId);
        }

        return new GenericArrayCollection($kb->paginate($request->get('perPage') ?? 15));
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(KbArticleRequest $request): KbArticle
    {
        $validated = $request->validated();
        $slug = Str::slug($request->name);
        $kb = KbArticle::create(array_merge($validated, ['slug' => $slug]));

        $categories = $request->categories ?? [];
        KbArticleCategory::where('kb_article_id', $kb->id)->delete();
        foreach ($categories as $category) {
            $kbCategory = KbCategory::whereSlug($category)->first();
            KbArticleCategory::create([
                'kb_category_id' => $kbCategory->id,
                'kb_article_id' => $kb->id,
            ]);
        }

        return $kb->refresh();
    }
    /**
     * Display the specified resource.
     */
    public function show(Request $request, KbArticle $article): KbArticle|array
    {
        $votes = KbArticleVote::where('kb_article_id', $article->id);
        $save = KbArticleSave::where('kb_article_id', $article->id)
            ->where('user_id', $request->user()->id)->exists();

        return array_merge($article->toArray(), [
            'votes' => $votes->count(),
            'user_vote' => $votes->where('user_id', Auth::user()->id)->get(),
            'save' => $save
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KbArticle $article): KbArticle
    {

        $validated = $this->validate($request, [
            'name' => ['required', 'min:25'],
            'content' => ['required', 'min:25'],
            'is_private' => ['required', 'boolean']
        ]);
        $article->fill($validated);
        if ($article->isDirty('name')) {
            $article->slug = Str::slug($article->name);
        }
        if ($request->has('categories')) {
            $this->syncArticleCategories($article, $request->input('categories'));
        }
        $article->save();
        return $article->refresh();
    }

    protected function syncArticleCategories(KbArticle $article, array $categorySlugs): void
    {
        $existingCategories = KbCategory::whereIn('slug', $categorySlugs)
            ->pluck('id')
            ->toArray();
        $article->categories()->sync($existingCategories);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KbArticle $article): void
    {
        $article->delete();
    }
}
