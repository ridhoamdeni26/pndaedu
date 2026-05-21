<?php

namespace App\Notifications\Teams;

use App\Models\TeamInvitation as TeamInvitationModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamInvitation extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly TeamInvitationModel $invitation,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $acceptUrl = url("/invitations/{$this->invitation->code}");

        return (new MailMessage)
            ->subject("You've been invited to join {$this->invitation->team->name}")
            ->greeting("Hello!")
            ->line("You have been invited to join the team **{$this->invitation->team->name}** as {$this->invitation->role->label()}.")
            ->action('Accept Invitation', $acceptUrl)
            ->line('This invitation link will remain valid until it is accepted or cancelled.');
    }
}
