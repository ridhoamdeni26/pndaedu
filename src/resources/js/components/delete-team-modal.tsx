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
import { destroy } from '@/routes/teams';
import type { Team } from '@/types';

export default function DeleteTeamModal({
    team,
    children,
}: PropsWithChildren<{ team: Team }>) {
    const [open, setOpen] = useState(false);
    const { delete: del, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        del(destroy(team.slug), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Team</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{team.name}</strong>?
                        This action cannot be undone and will remove all members.
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
                            Delete Team
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
