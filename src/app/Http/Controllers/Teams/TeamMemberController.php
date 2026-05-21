<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\UpdateTeamMemberRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class TeamMemberController extends Controller
{
    public function update(UpdateTeamMemberRequest $request, Team $team, User $user): RedirectResponse
    {
        $membership = $team->memberships()->where('user_id', $user->id)->firstOrFail();
        $membership->update(['role' => $request->validated('role')]);

        return back()->with('success', 'Member role updated.');
    }

    public function destroy(Team $team, User $user): RedirectResponse
    {
        $this->authorize('removeMember', $team);

        $team->memberships()->where('user_id', $user->id)->delete();

        if ($user->current_team_id === $team->id) {
            $fallback = $user->teams()->first();
            $fallback
                ? $user->switchTeam($fallback)
                : $user->update(['current_team_id' => null]);
        }

        return back()->with('success', 'Member removed from team.');
    }
}
