<?php

namespace App\Support;

use App\Enums\TeamRole;

readonly class UserTeam
{
    public function __construct(
        public int|string $id,
        public string $name,
        public string $slug,
        public bool $isPersonal,
        public ?TeamRole $role = null,
        public bool $isCurrent = false,
    ) {}

    public function toArray(): array
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'slug'      => $this->slug,
            'isPersonal' => $this->isPersonal,
            'role'      => $this->role?->value,
            'roleLabel' => $this->role?->label(),
            'isCurrent' => $this->isCurrent,
        ];
    }
}
