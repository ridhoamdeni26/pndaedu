<?php

namespace App\Http\Controllers\Teams;

use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\CreateTeamInvitationRequest;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Notifications\Teams\TeamInvitation as TeamInvitationNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Notifications\AnonymousNotifiable;

class TeamInvitationController extends Controller
{
    public function store(CreateTeamInvitationRequest $request, Team $team): RedirectResponse
    {
        $invitation = $team->invitations()->create($request->validated());

        (new AnonymousNotifiable)
            ->route('mail', $invitation->email)
            ->notify(new TeamInvitationNotification($invitation));

        return back()->with('success', "Invitation sent to {$invitation->email}.");
    }

    public function destroy(Team $team, TeamInvitation $invitation): RedirectResponse
    {
        $this->authorize('cancelInvitation', $team);

        $invitation->delete();

        return back()->with('success', 'Invitation cancelled.');
    }

    public function accept(string $code): RedirectResponse
    {
        $invitation = TeamInvitation::where('code', $code)->firstOrFail();
        $user       = auth()->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $team = $invitation->team;

        if (! $user->belongsToTeam($team)) {
            $team->memberships()->create([
                'user_id' => $user->id,
                'role'    => $invitation->role->value,
            ]);
        }

        $invitation->delete();
        $user->switchTeam($team);

        return redirect()->route('dashboard', ['current_team' => $team->slug])
            ->with('success', "You've joined {$team->name}!");
    }
}
