<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $users = User::paginate(15); 
            return response()->json($users, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch users.', 'error' => $e->getMessage()], 500);
        }
    }

    public function toggleBan(User $user)
    {
        try {
            $user->is_banned = !$user->is_banned;
            $user->save();
            
            $status = $user->is_banned ? 'banned' : 'unbanned';
            return response()->json(['message' => "User successfully {$status}.", 'user' => $user], 200);
            
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update user status.', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete user.', 'error' => $e->getMessage()], 500);
        }
    }
}