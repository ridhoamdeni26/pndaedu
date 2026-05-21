<?php

namespace App\Http\Requests\Teams;

use App\Enums\TeamRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('updateMember', $this->route('team'));
    }

    public function rules(): array
    {
        return [
            'role' => ['required', new Enum(TeamRole::class)],
        ];
    }
}
