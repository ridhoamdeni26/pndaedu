<?php

namespace App\Enums;

enum TeamPermission: string
{
    case UpdateTeam       = 'update-team';
    case DeleteTeam       = 'delete-team';
    case AddMember        = 'add-member';
    case UpdateMember     = 'update-member';
    case RemoveMember     = 'remove-member';
    case CreateInvitation = 'create-invitation';
    case CancelInvitation = 'cancel-invitation';
}
