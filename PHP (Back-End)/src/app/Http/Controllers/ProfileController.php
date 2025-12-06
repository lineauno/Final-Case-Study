<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
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

    public function show()
    {
        return response()->json([
            'user' => auth()->user(),
        ]);
    }
}