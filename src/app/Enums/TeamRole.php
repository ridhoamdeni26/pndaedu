<?php

namespace App\Enums;

enum TeamRole: string
{
    case Owner  = 'owner';
    case Admin  = 'admin';
    case Member = 'member';

    public function label(): string
    {
        return match ($this) {
            self::Owner  => 'Owner',
            self::Admin  => 'Admin',
            self::Member => 'Member',
        };
    }
}
