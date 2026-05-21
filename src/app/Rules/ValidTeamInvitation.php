<?php

namespace App\Rules;

use App\Models\TeamInvitation;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidTeamInvitation implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $invitation = TeamInvitation::where('code', $value)->first();

        if (! $invitation) {
            $fail('This invitation is invalid or has already been used.');
        }
    }
}
