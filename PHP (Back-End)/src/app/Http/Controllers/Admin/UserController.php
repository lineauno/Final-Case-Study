<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema; 

class UserController extends Controller
{
    /**
     * @route GET /api/admin/users
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            if ($search = $request->get('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }
            
            $sortField = $request->get('sort_by', 'created_at');
            $sortDir = $request->get('sort_dir', 'desc');

            $query->orderBy($sortField, $sortDir);
            
            $users = $query->select('id', 'name', 'email', 'is_admin', 'is_banned', 'created_at')
                           ->paginate($request->get('per_page', 15));
            
            return response()->json($users, 200);

        } catch (\Exception $e) {
            Log::error('Admin User Index Error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to fetch users. Please check the server logs.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @route PUT /api/admin/users/{user}
     */
    public function update(Request $request, User $user)
    {
        // 1. Validate the incoming request data
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes', 
                'email', 
                Rule::unique('users')->ignore($user->id)
            ],
            'is_admin' => 'sometimes|boolean', 
        ]);

        try {
            $user->update($request->only('name', 'email', 'is_admin')); 

            $user->refresh()->makeVisible(['is_admin', 'is_banned']); 

            return response()->json(['message' => 'User updated successfully.', 'user' => $user], 200);

        } catch (\Exception $e) {
            Log::error('Admin User Update Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update user.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * @route POST /api/admin/users/{user}/ban
     */
    public function toggleBan(User $user)
    {
        try {
            $user->is_banned = !$user->is_banned;
            $user->save();
            
            $status = $user->is_banned ? 'banned' : 'unbanned';
            
            $user->refresh();
            
            $userData = $user->only('id', 'name', 'email', 'is_admin', 'is_banned', 'created_at');
            
            return response()->json(['message' => "User successfully {$status}.", 'user' => $userData], 200);
            
        } catch (\Exception $e) {
            Log::error('Admin User Toggle Ban Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update user status.', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * @route DELETE /api/admin/users/{user}
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return response()->json(null, 204); 
        } catch (\Exception $e) {
            Log::error('Admin User Delete Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete user.', 'error' => $e->getMessage()], 500);
        }
    }
}