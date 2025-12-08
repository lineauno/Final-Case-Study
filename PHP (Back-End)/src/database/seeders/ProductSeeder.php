<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Executes the product inventory seeding process.
     * * Ensures a default 'General Art Supplies' category exists to prevent foreign 
     * key constraint violations. It then iterates through a predefined list of 
     * art products, utilizing 'updateOrCreate' to populate the database with 
     * initial stock, pricing, and visual asset references while preventing 
     * duplicate records based on the product name.
     */
    public function run(): void
    {
        $category = Category::firstOrCreate(
            ['slug' => 'general-art-supplies'],
            ['name' => 'General Art Supplies', 'description' => 'Default category.']
        );
        $defaultCategoryId = $category->id;

        $yourProducts = [
            [
                'name' => 'Vibrant Watercolor Set',
                'description' => '12 colors with high pigment saturation and travel brush.',
                'price' => 35.99,
                'image_url' => '/assets/images/vibrant-watercolor-set.png',
                'stock' => 25,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Luxury Rollerball Pen',
                'description' => 'Smooth-writing pen with a sleek, metallic finish.',
                'price' => 12.99,
                'image_url' => '/assets/images/luxury-rollerball-pen.png',
                'stock' => 40,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Premium Sketchbook',
                'description' => 'A professional-grade sketchbook with 80 sheets.',
                'price' => 19.50,
                'image_url' => '/assets/images/premium-sketchbook.png',
                'stock' => 35,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'DIY Clay Kit',
                'description' => 'Everything you need to sculpt and create custom figures.',
                'price' => 25.00,
                'image_url' => '/assets/images/diy-clay-kit.png',
                'stock' => 15,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Fine Detail Brush Set',
                'description' => 'Set of 10 miniature brushes for precise painting.',
                'price' => 15.75,
                'image_url' => '/assets/images/fine-detail-brush-set.png',
                'stock' => 60,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'A3 Cutting Mat',
                'description' => 'Self-healing, double-sided mat with grid lines.',
                'price' => 18.00,
                'image_url' => '/assets/images/a3-cutting-mat.png',
                'stock' => 20,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Pastel Acrylic Paints',
                'description' => 'Set of 12 soft-hued acrylic paints.',
                'price' => 28.99,
                'image_url' => '/assets/images/pastel-acrylic-paints.png',
                'stock' => 30,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Vintage Washi Tape',
                'description' => 'Collection of 8 rolls of decorative paper tape.',
                'price' => 9.99,
                'image_url' => '/assets/images/vintage-washi-tape.png',
                'stock' => 75,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Heavy Body Acrylic Set',
                'description' => 'Professional grade acrylics with thick consistency for texture.',
                'price' => 45.00,
                'image_url' => 'https://imgs.search.brave.com/9kmLkd4sE7hCouNNwQZEEhsC9fL9h-2CqdH4RYyzr7U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGlxdWl0ZXguY29t/L2Nkbi9zaG9wL2Zp/bGVzLzcwMjQ0XzM3/NXgzNzVfY3JvcF9j/ZW50ZXIuanBnP3Y9/MTcwNzk5NTUyOA',
                'stock' => 18,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Stretched Canvas Pack',
                'description' => 'Pack of 3 pre-primed white canvases (16x20 inch).',
                'price' => 29.99,
                'image_url' => 'https://imgs.search.brave.com/-FULlXQck-QQQxvASAkWEP1kYHB6yaKhJH0ILt_75Cg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcnRl/emEuY28udWsvY2Ru/L3Nob3AvcHJvZHVj/dHMvc3RyZXRjaGVk/LWNhbnZhcy1wcmVt/aXVtLTgteC0xMC1p/bmNoLTEyLXBhY2tf/bmM3amJCUFBfNTEy/eDUxNS5qcGc_dj0x/NjUyOTU0NDEy',
                'stock' => 50,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Wooden Mixing Palette',
                'description' => 'Classic kidney-shaped wooden palette for oil painting.',
                'price' => 8.50,
                'image_url' => 'https://imgs.search.brave.com/vmr3wYOkhWoZmgdLN3RKE1PgUcKtoMRHoKEODggqP40/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlZW5ncmF2ZWRz/dG9yZS5jb20vY2Ru/L3Nob3AvZmlsZXMv/S1JTXzI4MjUuanBn/P3Y9MTY5NzQwMjU5/NiZ3aWR0aD0xMDgw',
                'stock' => 100,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Aluminum Field Easel',
                'description' => 'Lightweight, collapsible easel perfect for outdoor painting.',
                'price' => 32.00,
                'image_url' => 'https://imgs.search.brave.com/_Sf0ZRgftUyMtLdST95dhXpYT89hfZV33GjEEKlL8h0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2F5YXJpY3JhZnRz/LmNvLmtlL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzEwL2Fs/dW1pbnVtLWZpZWxk/LWVhc2VsLTEuanBn',
                'stock' => 10,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Artist Colored Pencils',
                'description' => 'Set of 48 soft-core colored pencils for blending and shading.',
                'price' => 24.99,
                'image_url' => 'https://imgs.search.brave.com/LwvfJlJcIwwMoKswviM_ndZwfr4aJEKu1TqEU3RceDc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFUOW80U1BzR0wu/anBn',
                'stock' => 45,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Willow Charcoal Sticks',
                'description' => 'Box of 25 natural willow charcoal sticks for sketching.',
                'price' => 6.99,
                'image_url' => '/assets/images/willow-charcoal-sticks.png',
                'stock' => 80,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Canvas Artist Apron',
                'description' => 'Durable canvas apron with multiple pockets for tools.',
                'price' => 16.50,
                'image_url' => '/assets/images/canvas-artist-apron.png',
                'stock' => 30,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Matte Varnish & Glue',
                'description' => 'All-in-one sealer, glue, and finish for decoupage.',
                'price' => 7.99,
                'image_url' => 'https://imgs.search.brave.com/QJpnod8ZZNXjjDJibFcCXgdYEjPvOfZ-hZDfjAFlaNo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9haXN0/Y3JhZnQuY29tLzU2/NDgtbGFyZ2VfZGVm/YXVsdC9kZWNvdXBh/Z2UtZ2x1ZS1hbmQt/dmFybmlzaC1tYXR0/ZS5qcGc',
                'stock' => 65,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Fine Line Ink Pens',
                'description' => 'Set of 6 black waterproof pens with varying nib sizes.',
                'price' => 11.50,
                'image_url' => 'https://imgs.search.brave.com/0NgnxOwufdjHNU4FY9pcid8pSUetIadHzau5o2Prnes/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjExbUpITU85aEwu/anBn',
                'stock' => 55,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Ergonomic Desk Stapler',
                'description' => 'Heavy-duty stapler with an ergonomic design and 20-sheet capacity.',
                'price' => 14.99,
                'image_url' => '/assets/images/ergonomic-desk-stapler.png',
                'stock' => 90,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Self-Adhesive Sticky Notes',
                'description' => 'Pack of 10 bright-colored pads for quick reminders.',
                'price' => 5.50,
                'image_url' => '/assets/images/self-adhesive-sticky-notes.png',
                'stock' => 120,
                'is_featured' => false,
                'category_id' => $defaultCategoryId,
            ],
            [
                'name' => 'Metallic Gel Pen Set',
                'description' => 'Set of 12 smooth-flowing gel pens with shimmering metallic inks.',
                'price' => 18.25,
                'image_url' => '/assets/images/metallic-gel-pen-set.png',
                'stock' => 70,
                'is_featured' => true,
                'category_id' => $defaultCategoryId,
            ],
        ];

        foreach ($yourProducts as $productData) {
            Product::updateOrCreate(
                ['name' => $productData['name']], 
                $productData
            );
        }
    }
}