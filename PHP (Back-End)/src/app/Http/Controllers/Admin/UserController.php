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
     * Retrieves a paginated list of users with search and sort capabilities.
     * Supports filtering by name/email and dynamic sorting. Returns restricted
     * attributes to ensure security while listing.
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
     * Updates an existing user's profile details and administrative permissions.
     * Performs conditional validation to ensure email uniqueness (ignoring current ID)
     * and refreshes the model to display updated secure fields.
     */
    public function update(Request $request, User $user)
    {
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
     * Toggles the ban status of a specific user.
     * Flips the boolean state of 'is_banned', persists the change, and returns 
     * the updated user object with relevant status messaging.
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
     * Permanently deletes a user record from the system.
     * Utilizes Route Model Binding for record identification and returns a 204
     * No Content response upon successful deletion.
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