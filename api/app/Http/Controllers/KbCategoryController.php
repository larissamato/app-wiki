<?php

namespace App\Http\Controllers;

use App\Http\Resources\GenericArrayCollection;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\StoreKbCategoryRequest;
use App\Http\Requests\UpdateKbCategoryRequest;
use App\Models\KbCategory;

class KbCategoryController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(KbCategory::class, 'category');
    }

    public function index(Request $request):GenericArrayCollection
    {
        $kb = $this->search($request, new KbCategory(), ['name', 'slug'])
            ->with('children');

        return new GenericArrayCollection($kb->paginate($request->get('perPage') ?? 15));
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKbCategoryRequest $request): KbCategory
    {
        $validated = $request->validated();
        $slug = Str::slug($request->name);
        return KbCategory::create(array_merge(
            $validated,
            [
                'slug' => $slug,
                'category_parent_id' => (KbCategory::whereSlug($request->category_parent)->first()->id ?? null)
            ]
        ))->refresh();
    }

    /**
     * Display the specified resource.
     */
    public function show(KbCategory $category): KbCategory
    {
        return $category;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKbCategoryRequest $request, KbCategory $category): KbCategory
    {
        $validated = $request->validated();

        $category->fill(array_merge(
            $validated,
            [
                'slug' => Str::slug($request->name),
                'category_parent_id' =>  isset($validated['category_parent'])
                    ? KbCategory::whereSlug($validated['category_parent'])->first()->id
                    : null
            ]
        ));

        $category->save();
        return $category->refresh();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KbCategory $category): void
    {
        $category->delete();
    }
}
