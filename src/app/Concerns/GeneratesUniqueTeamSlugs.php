<?php

namespace App\Concerns;

use Illuminate\Support\Str;

trait GeneratesUniqueTeamSlugs
{
    protected static function bootGeneratesUniqueTeamSlugs(): void
    {
        static::creating(function ($model): void {
            if (empty($model->slug)) {
                $model->slug = static::generateUniqueSlug($model->name);
            }
        });
    }

    protected static function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i    = 1;

        while (static::withTrashed()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
