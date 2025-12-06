<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Check if the user is logged in
        if (!auth()->check()) {
            // Return 401 Unauthorized if no user is logged in
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // 2. Check if the logged-in user has admin privileges
        // This relies on the 'is_admin' column being in your users table.
        if (auth()->user()->is_admin) {
            return $next($request);
        }

        // 3. If logged in but not an admin, return 403 Forbidden
        return response()->json(['message' => 'Access denied. Admin privileges required.'], 403);
    }
}