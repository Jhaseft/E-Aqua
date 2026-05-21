<?php

namespace App\Http\Controllers;

use Inertia\Inertia; 
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class VentasController extends Controller
{
 public function index(Request $request)
{
    $search = $request->query('search', '');
    $perPage = 4;

    $total = Category::whereNull('parent_id')->count();

    $categories = Category::whereNull('parent_id')
        ->skip(0)
        ->take($perPage)
        ->get()
        ->map(fn($category) => $this->buildCategoryData($category, $search));

    return Inertia::render('Admin/Ventas', [
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

    return Inertia::render('Products/ShowProductadmin', [
        'product' => [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'image' => $product->multimedia->first()?->url,
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
        'id'       => $child->id,
        'name'     => $child->name,
        'products' => $child->products->values()->all(),
    ]);

    return [
        'id'       => $category->id,
        'name'     => $category->name,
        'products' => $categoryProducts->values()->all(),
        'children' => $children->values()->all(),
    ];
}

 
public function searchBySku(Request $request)
{
    $sku = $request->query('sku');

    if (!$sku) {
        return response()->json(['products' => []]);
    }

    // Buscar productos que tengan la variante con el SKU exacto
    $products = Product::whereHas('variants', function ($query) use ($sku) {
        $query->where('sku', $sku);
    })
    ->with(['variants.values.attribute', 'multimedia'])
    ->get();

    // Modificar la respuesta para incluir solo la variante correspondiente al SKU
    $productsWithAttributes = $products->map(function ($product) use ($sku) {
        // Filtrar la variante exacta por SKU
        $variant = $product->variants->firstWhere('sku', $sku);

        // Agregar atributos solo de esa variante
        $product->attributes = $variant ? $variant->values->map(function ($value) {
            return [
                'attribute' => $value->attribute->name, // Nombre del atributo
                'value' => $value->value,               // Valor del atributo (ej: talla)
            ];
        }) : [];

        // Reemplazar variants con solo la variante correspondiente
        $product->variants = $variant ? collect([$variant]) : collect();

        return $product;
    });

    return response()->json([
        'products' => $productsWithAttributes,
    ]);
}


}
