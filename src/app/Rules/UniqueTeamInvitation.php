<?php

namespace App\Rules;

use App\Models\Team;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniqueTeamInvitation implements ValidationRule
{
    public function __construct(private readonly Team $team) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $alreadyMember = $this->team->members()->where('email', $value)->exists();
        $alreadyInvited = $this->team->invitations()->where('email', $value)->exists();

        if ($alreadyMember) {
            $fail('This user is already a member of the team.');
        } elseif ($alreadyInvited) {
            $fail('This email already has a pending invitation.');
        }
    }
}
