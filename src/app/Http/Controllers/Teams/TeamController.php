<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\CreateTeam;
use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $user->load(['teams.memberships.user', 'teams.invitations']);

        $teams = $user->teams->map(function (Team $team) use ($user) {
            return [
                ...$user->toUserTeam($team),
                'permissions' => $user->teamPermissions($team)->toArray(),
                'members'     => $team->memberships->map(fn ($m) => [
                    'id'         => $m->user->id,
                    'name'       => $m->user->name,
                    'email'      => $m->user->email,
                    'avatar'     => $m->user->avatar,
                    'role'       => $m->role->value,
                    'role_label' => $m->role->label(),
                ]),
                'invitations' => $team->invitations->map(fn ($inv) => [
                    'code'       => $inv->code,
                    'email'      => $inv->email,
                    'role'       => $inv->role->value,
                    'role_label' => $inv->role->label(),
                    'created_at' => $inv->created_at->toDateTimeString(),
                ]),
            ];
        });

        return Inertia::render('backend/settings/teams', [
            'teams'       => $teams,
            'currentTeam' => $user->currentTeam ? $user->toUserTeam($user->currentTeam) : null,
        ]);
    }

    public function store(Request $request, CreateTeam $createTeam): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $team = $createTeam->handle($request->user(), $request->input('name'));

        return redirect()->route('teams.index')
            ->with('success', "Team \"{$team->name}\" created.");
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
        $this->authorize('update', $team);

        $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $team->update(['name' => $request->input('name')]);

        return back()->with('success', 'Team name updated.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        $this->authorize('delete', $team);

        $user = auth()->user();

        $team->delete();

        if ($user->current_team_id === $team->id) {
            $fallback = $user->teams()->first();
            if ($fallback) {
                $user->switchTeam($fallback);
            } else {
                $user->update(['current_team_id' => null]);
            }
        }

        return redirect()->route('teams.index')
            ->with('success', 'Team deleted.');
    }

    public function switch(Request $request, string $current_team): RedirectResponse
    {
        $user = $request->user();
        $team = Team::where('slug', $current_team)->firstOrFail();

        if (! $user->belongsToTeam($team)) {
            abort(403);
        }

        $user->switchTeam($team);

        return redirect()->back();
    }
}
