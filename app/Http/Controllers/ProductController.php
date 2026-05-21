<?php

namespace App\Http\Controllers;

use Inertia\Inertia; 
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
 
class ProductController extends Controller
{
    public function index(Request $request)
{
    $search  = $request->query('search', '');
    $perPage = 8;

    $total = Category::whereNull('parent_id')->count();

    $categories = Category::whereNull('parent_id')
        ->skip(0)
        ->take($perPage)
        ->get()
        ->map(fn($category) => $this->buildCategoryData($category, $search));

    return Inertia::render('Welcome', [
        'auth' => [
            'user' => auth()->user() ? auth()->user()->only('id', 'name', 'email') : null,
        ],
        'categories' => $categories->values()->all(),
        'search'     => $search,
        'page'       => 1,
        'hasMore'    => $total > $perPage,
    ]);
}

    public function show($slug, $id)
{
    $product = Product::where('available', 1)
        ->with([
            'variants.values.attribute',
            'multimedia'
        ])
        ->findOrFail($id);

    return Inertia::render('Products/ShowProduct', [
        'product' => [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'multimedia' => $product->multimedia->map(fn ($m) => [
                'id' => $m->id,
                'url' => $m->url,
                'type' => $m->type ?? 'image', // opcional (image / video)
            ]),
            'variants' => $product->variants->map(fn($v) => [
                'id' => $v->id,
                'stock' => $v->stock,
                'sku' => $v->sku,
                'price' => $v->price,
                'values' => $v->values->map(fn($val) => [
                    'attribute' => $val->attribute->name,
                    'value' => $val->value
                ])
            ])
        ]
    ]);
}

public function getCategoriasJson(Request $request)
{
    $search  = $request->query('search', '');
    $offset  = (int) $request->query('offset', 0);
    $perPage = 2;

    $total = Category::whereNull('parent_id')->count();

    $categories = Category::whereNull('parent_id')
        ->skip($offset)
        ->take($perPage)
        ->get()
        ->map(fn($category) => $this->buildCategoryData($category, $search));

    return response()->json([
        'categories' => $categories->values()->all(),
        'hasMore'    => $total > $offset + $perPage,
    ]);
}

private function buildCategoryData($category, string $search): array
{
    $categoryProducts = $category->products()
        ->where('available', 1)
        ->when($search, fn($q) => $q->where('name', 'like', “%$search%”))
        ->with(['variants.values.attribute', 'multimedia'])
        ->get();

    $children = $category->children()->with(['products' => function ($q) use ($search) {
        $q->where('available', 1)
          ->when($search, fn($q2) => $q2->where('name', 'like', “%$search%”))
          ->with(['variants.values.attribute', 'multimedia']);
    }])->get()->map(fn($child) => [
        'id'          => $child->id,
        'name'        => $child->name,
        'description' => $child->description,
        'products'    => $child->products->values()->all(),
    ]);

    return [
        'id'          => $category->id,
        'name'        => $category->name,
        'description' => $category->description,
        'products'    => $categoryProducts->values()->all(),
        'children'    => $children->values()->all(),
    ];
}


}
