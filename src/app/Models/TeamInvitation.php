<?php

namespace App\Models;

use App\Enums\TeamRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class TeamInvitation extends Model
{
    use HasUuids;

    protected $fillable = ['code', 'team_id', 'email', 'role'];

    protected $casts = [
        'role' => TeamRole::class,
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(fn ($model) => $model->code ??= Str::random(32));
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
