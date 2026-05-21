<?php

namespace App\Concerns;

use App\Enums\TeamPermission;
use App\Enums\TeamRole;
use App\Models\Team;
use App\Support\TeamPermissions;
use App\Support\UserTeam;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait HasTeams
{
    public function currentTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'current_team_id');
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'memberships')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function personalTeam(): ?Team
    {
        return $this->teams()->where('is_personal', true)->first();
    }

    public function switchTeam(Team $team): void
    {
        $this->update(['current_team_id' => $team->id]);
        $this->setRelation('currentTeam', $team);
    }

    public function belongsToTeam(Team $team): bool
    {
        return $this->teams->contains($team);
    }

    public function teamRole(Team $team): ?TeamRole
    {
        $pivot = $this->teams->find($team->id)?->pivot;

        return $pivot ? TeamRole::tryFrom($pivot->role) : null;
    }

    public function hasTeamPermission(Team $team, TeamPermission $permission): bool
    {
        $role = $this->teamRole($team);

        if ($role === null) {
            return false;
        }

        return match ($role) {
            TeamRole::Owner  => true,
            TeamRole::Admin  => ! in_array($permission, [TeamPermission::DeleteTeam]),
            TeamRole::Member => in_array($permission, [TeamPermission::AddMember]),
        };
    }

    public function teamPermissions(Team $team): TeamPermissions
    {
        return new TeamPermissions(
            canUpdateTeam:       $this->hasTeamPermission($team, TeamPermission::UpdateTeam),
            canDeleteTeam:       $this->hasTeamPermission($team, TeamPermission::DeleteTeam),
            canAddMember:        $this->hasTeamPermission($team, TeamPermission::AddMember),
            canUpdateMember:     $this->hasTeamPermission($team, TeamPermission::UpdateMember),
            canRemoveMember:     $this->hasTeamPermission($team, TeamPermission::RemoveMember),
            canCreateInvitation: $this->hasTeamPermission($team, TeamPermission::CreateInvitation),
            canCancelInvitation: $this->hasTeamPermission($team, TeamPermission::CancelInvitation),
        );
    }

    public function toUserTeam(Team $team): array
    {
        $pivot = $this->teams->find($team->id)?->pivot;
        $role  = $pivot ? TeamRole::tryFrom($pivot->role) : null;

        return (new UserTeam(
            id:        $team->id,
            name:      $team->name,
            slug:      $team->slug,
            isPersonal: $team->is_personal,
            role:      $role,
            isCurrent: $this->current_team_id === $team->id,
        ))->toArray();
    }

    public function toUserTeams(bool $includeCurrent = false): array
    {
        return $this->teams->map(fn ($team) => $this->toUserTeam($team))->values()->all();
    }
}
