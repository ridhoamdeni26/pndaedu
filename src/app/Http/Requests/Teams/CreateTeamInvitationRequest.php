<?php

namespace App\Http\Requests\Teams;

use App\Enums\TeamRole;
use App\Rules\UniqueTeamInvitation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CreateTeamInvitationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('inviteMember', $this->route('team'));
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', new UniqueTeamInvitation($this->route('team'))],
            'role'  => ['required', new Enum(TeamRole::class)],
        ];
    }
}
