<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'frontend/home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/checkout', 'frontend/checkout')->name('checkout');

Route::inertia('/classes', 'frontend/classes')->name('classes');

Route::inertia('/placement-test', 'frontend/placement-test')->name('placement-test');

Route::inertia('/study-tour', 'frontend/study-tour')->name('study-tour');

Route::inertia('/college-china', 'frontend/college-china')->name('college-china');

Route::inertia('/about-us', 'frontend/about-us')->name('about-us');

Route::inertia('/news', 'frontend/news')->name('news');

// Team invitation accept (public — user must be logged in to accept)
Route::get('/invitations/{code}', [TeamInvitationController::class, 'accept'])
    ->middleware('auth')
    ->name('teams.invitations.accept');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'backend/dashboard')->name('dashboard');
    });

require __DIR__ . '/settings.php';
