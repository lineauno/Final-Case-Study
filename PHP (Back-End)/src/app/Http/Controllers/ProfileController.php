<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Updates the authenticated user's profile information.
     * * Extracts name and email from the validated request. If a new password 
     * is provided, it is securely hashed before persistence. The method 
     * returns the refreshed user model instance.
     */
    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $request->user();

        $updateData = $request->only('name', 'email');
        
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->input('password'));
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Profile updated successfully!',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Retrieves the current authenticated user's details.
     * * Returns a JSON representation of the user currently logged 
     * into the system session.
     */
    public function show()
    {
        return response()->json([
            'user' => auth()->user(),
        ]);
    }
}