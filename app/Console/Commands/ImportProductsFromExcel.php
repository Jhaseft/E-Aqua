<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductMultimedia;

class ImportProductsFromExcel extends Command
{
    protected $signature = 'import:products {file : Ruta al archivo Excel relativa a la raíz del proyecto}';
    protected $description = 'Importa productos desde un Excel con links de Cloudinary (soporta variantes de peso)';

    public function handle(): int
    {
        $path = base_path($this->argument('file'));

        if (!file_exists($path)) {
            $this->error("Archivo no encontrado: {$path}");
            return self::FAILURE;
        }

        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        array_shift($rows); // eliminar fila de encabezados

        $created = 0;
        $skipped = 0;

        foreach ($rows as $lineNum => $row) {
            // A: category_name | B: name | C: description
            // D: price (base, vacío si usa variantes)
            // E: available (1/0)
            // F: variant_1_label (ej: "20kg") | G: variant_1_price
            // H: variant_2_label (ej: "200kg") | I: variant_2_price
            // J: image_url_1 | K: image_url_2 | L: image_url_3

            $categoryName   = trim((string)($row['A'] ?? ''));
            $name           = trim((string)($row['B'] ?? ''));
            $description    = trim((string)($row['C'] ?? ''));
            $basePrice      = $row['D'] ?? null;
            $available      = isset($row['E']) && $row['E'] !== '' ? (bool)(int)$row['E'] : true;
            $var1Label      = trim((string)($row['F'] ?? ''));
            $var1Price      = $row['G'] ?? null;
            $var2Label      = trim((string)($row['H'] ?? ''));
            $var2Price      = $row['I'] ?? null;
            $imageUrls      = array_values(array_filter([
                trim((string)($row['J'] ?? '')),
                trim((string)($row['K'] ?? '')),
                trim((string)($row['L'] ?? '')),
            ]));

            if ($categoryName === '' || $name === '') {
                $this->warn("Fila {$lineNum}: omitida (falta category_name o name).");
                $skipped++;
                continue;
            }

            $hasVariants = $var1Label !== '' && $var1Price !== null && $var1Price !== '';

            // Productos sin precio ni variantes → precio 0 (cotizar)
            $resolvedPrice = 0;
            if (!$hasVariants && $basePrice !== null && $basePrice !== '') {
                $resolvedPrice = (float)str_replace(',', '.', (string)$basePrice);
            }

            $category = Category::firstOrCreate(
                ['name' => $categoryName],
                ['slug' => Str::slug($categoryName)]
            );

            $product = Product::create([
                'category_id' => $category->id,
                'name'        => $name,
                'description' => $description,
                'price'       => $resolvedPrice,
                'available'   => $available,
            ]);

            // Crear variantes si existen
            if ($hasVariants) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'sku'        => Str::slug($name) . '-' . Str::slug($var1Label),
                    'price'      => (float)str_replace(',', '.', (string)$var1Price),
                    'stock'      => 0,
                ]);

                if ($var2Label !== '' && $var2Price !== null && $var2Price !== '') {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'sku'        => Str::slug($name) . '-' . Str::slug($var2Label),
                        'price'      => (float)str_replace(',', '.', (string)$var2Price),
                        'stock'      => 0,
                    ]);
                }
            }

            // Multimedia
            foreach ($imageUrls as $order => $url) {
                ProductMultimedia::create([
                    'product_id' => $product->id,
                    'url'        => $url,
                    'type'       => 'image',
                    'sort_order' => $order,
                ]);
            }

            $varInfo = $hasVariants ? " [{$var1Label}" . ($var2Label ? ", {$var2Label}" : '') . ']' : '';
            $this->line("  + [{$category->name}] {$name}{$varInfo}");
            $created++;
        }

        $this->newLine();
        $this->info("Listo: {$created} productos creados, {$skipped} filas omitidas.");

        return self::SUCCESS;
    }
}
