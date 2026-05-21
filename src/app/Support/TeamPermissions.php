<?php

namespace App\Support;

readonly class TeamPermissions
{
    public function __construct(
        public bool $canUpdateTeam       = false,
        public bool $canDeleteTeam       = false,
        public bool $canAddMember        = false,
        public bool $canUpdateMember     = false,
        public bool $canRemoveMember     = false,
        public bool $canCreateInvitation = false,
        public bool $canCancelInvitation = false,
    ) {}

    public function toArray(): array
    {
        return [
            'canUpdateTeam'       => $this->canUpdateTeam,
            'canDeleteTeam'       => $this->canDeleteTeam,
            'canAddMember'        => $this->canAddMember,
            'canUpdateMember'     => $this->canUpdateMember,
            'canRemoveMember'     => $this->canRemoveMember,
            'canCreateInvitation' => $this->canCreateInvitation,
            'canCancelInvitation' => $this->canCancelInvitation,
        ];
    }
}
