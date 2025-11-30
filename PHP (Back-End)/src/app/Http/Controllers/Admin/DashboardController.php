Try AI directly in your favorite apps … Use Gemini to generate drafts and refine content, plus get Gemini Pro with access to Google's next-gen AI for ₱1,100 ₱0 for 1 month
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
{
    try {
        $lowStockThreshold = 10;
        
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalUsers = User::count();
        
        $totalRevenue = 0;
        
        $lowStockCount = Product::where('stock', '<', $lowStockThreshold)->count();

        $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get(['id', 'name', 'created_at']);

        $dashboardData = [
            'metrics' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'totalUsers' => $totalUsers,
                'totalRevenue' => $totalRevenue,
                'lowStockCount' => $lowStockCount,
            ],
                'recentActivity' => [
                    'recentUsers' => $recentUsers,
                ]
            ];
            
            return response()->json($dashboardData, 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to load dashboard data. Ensure all database tables are migrated.', 'error' => $e->getMessage()], 500);
        }
    }
}