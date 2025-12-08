<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registers a new user and generates an authentication token.
     * * Validates account uniqueness and password confirmation before persisting 
     * the user with a hashed password. Returns user details and a Bearer token.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Authenticates a user and establishes a session.
     * * Verifies credentials and checks if the user is currently banned. 
     * Upon success, deletes old tokens to ensure a fresh session, identifies 
     * the user role, and returns user metadata with an access token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid login credentials.'],
            ]);
        }

        if ($user->is_banned) {
            return response()->json([
                'message' => 'Your account has been banned. Please contact support.'
            ], 403);
        }
    
        $user->tokens()->delete(); 
        
        $token = $user->createToken('auth_token')->plainTextToken;

        $role = $user->is_admin ? 'Admin' : 'Customer'; 

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role,     
                'is_admin' => $user->is_admin, 
                'is_banned' => $user->is_banned,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Invalidates the user's current access token.
     * * Revokes the token provided in the request header to log the user out
     * from the current device session.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}