import { useForm } from '@inertiajs/react';
import { type PropsWithChildren, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { destroy } from '@/routes/teams/invitations';
import type { Team, TeamInvitation } from '@/types';

export default function CancelInvitationModal({
    team,
    invitation,
    children,
}: PropsWithChildren<{ team: Team; invitation: TeamInvitation }>) {
    const [open, setOpen] = useState(false);
    const { delete: del, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        del(destroy(team.slug, invitation.code), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Invitation</DialogTitle>
                    <DialogDescription>
                        Cancel the invitation sent to{' '}
                        <strong>{invitation.email}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Keep
                        </Button>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            Cancel Invitation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
