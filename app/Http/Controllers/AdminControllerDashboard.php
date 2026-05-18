<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Str;

class AdminControllerDashboard extends Controller
{
    /**
     * Página principal del panel admin con categorías y subcategorías
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('perPage', 10);
        $search  = $request->string('search', '');

       $categories = Category::withCount('products')
    ->with(['children' => function($query) {
        $query->withCount('products'); //  agrega products_count a los hijos
    }])
    ->whereNull('parent_id')
    ->when($search, function($query, $search) {
        $query->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
    })
    ->paginate($perPage)
    ->onEachSide(1);

        return Inertia::render('Admin/AdminDashboard', [
            'categories' => $categories,
            'filters'    => ['search' => $search],
        ]);
    }

    /**
     * Crear una nueva categoría o subcategoría (AJAX)
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:500',
            'parent_id'   => 'nullable|exists:categories,id', // permite subcategorías
        ]);

        $category = Category::create([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
            'parent_id'   => $request->parent_id, 
        ]);

        return response()->json([
            'success'  => true,
            'category' => $category
        ]);
    }

    /**
     * Actualizar categoría o subcategoría
     */
    public function updateCategory(Request $request, Category $category)
    {
        $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:500',
            'parent_id'   => 'nullable|exists:categories,id',
        ]);

        // Evitar que una categoría se haga hija de sí misma
        if ($request->parent_id == $category->id) {
            return response()->json([
                'success' => false,
                'message' => 'Una categoría no puede ser su propia subcategoría'
            ], 422);
        }

        $category->update([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
            'parent_id'   => $request->parent_id,
        ]);

        return response()->json([
            'success'  => true,
            'category' => $category
        ]);
    }

    /**
     * Eliminar categorías o subcategorías recursivamente
     */
    public function bulkDeleteCategories(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:categories,id',
        ]);

        // Eliminar categorías y subcategorías de manera recursiva
        foreach ($request->ids as $id) {
            $category = Category::find($id);
            if ($category) {
                $this->deleteCategoryRecursively($category);
            }
        }

        return response()->json(['success' => true]);
    }

    private function deleteCategoryRecursively(Category $category)
{
    // Cargar todo lo relacionado antes de borrar
    $category->load([
        'children',
        'products.variants.values',
        'products.multimedia',
        'products.variants'
    ]);

    /**
     * 1. Borrar productos y TODA su estructura
     */
    foreach ($category->products as $product) {

        // 1.1 borrar multimedia del producto
        $product->multimedia()->delete();

        // 1.2 borrar variantes y sus valores pivot
        foreach ($product->variants as $variant) {
            // borrar pivotes en product_variant_values
            $variant->values()->detach();
            // borrar la variante
            $variant->delete();
        }

        // 1.3 borrar el producto
        $product->delete();
    }

    /**
     * 2. Borrar subcategorías recursivamente
     */
    foreach ($category->children as $child) {
        $this->deleteCategoryRecursively($child);
    }

    /**
     * 3. Finalmente borrar categoría
     */
    $category->delete();
}


    /**
     * Paginación vía AJAX (React) para categorías raíz
     */
   public function paginateCategories(Request $request)
{
    $perPage = $request->integer('perPage', 4);
    $search  = $request->string('search', '');

    $categories = Category::withCount('products') // 🔥 IMPORTANTE
        ->with('children')
        ->whereNull('parent_id')
        ->when($search, function($query, $search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        })
        ->paginate($perPage)
        ->onEachSide(1);

    return response()->json($categories);
}

}
