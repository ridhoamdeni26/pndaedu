<?php

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTeamMembership
{
    public function handle(Request $request, Closure $next): Response
    {
        $teamSlug = $request->route('current_team');
        $user     = $request->user();

        if (! $teamSlug || ! $user) {
            abort(403);
        }

        $team = Team::where('slug', $teamSlug)->firstOrFail();

        if (! $user->belongsToTeam($team)) {
            abort(403, 'You do not belong to this team.');
        }

        if ($user->current_team_id !== $team->id) {
            $user->switchTeam($team);
        }

        return $next($request);
    }
}
