<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Must be true since the route is protected by auth:sanctum
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // Name is required
            'name' => ['required', 'string', 'max:255'],
            
            // Email is required and unique, but must ignore the current user's email
            'email' => [
                'required',
                'email',
                'max:255',
                // This ensures the user can keep their existing email without a 'unique' violation
                Rule::unique('users')->ignore($this->user()->id),
            ],
            
            'password' => ['nullable', 'confirmed', 'min:8'],
        ];
    }
}