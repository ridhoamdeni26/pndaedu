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
import { destroy } from '@/routes/teams/members';
import type { Team, TeamMember } from '@/types';

export default function RemoveMemberModal({
    team,
    member,
    children,
}: PropsWithChildren<{ team: Team; member: TeamMember }>) {
    const [open, setOpen] = useState(false);
    const { delete: del, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        del(destroy(team.slug, member.id), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove Member</DialogTitle>
                    <DialogDescription>
                        Remove <strong>{member.name}</strong> from{' '}
                        <strong>{team.name}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            Remove
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
