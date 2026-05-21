import { router, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Trash2, UserMinus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import CancelInvitationModal from '@/components/cancel-invitation-modal';
import CreateTeamModal from '@/components/create-team-modal';
import DeleteTeamModal from '@/components/delete-team-modal';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import InviteMemberModal from '@/components/invite-member-modal';
import RemoveMemberModal from '@/components/remove-member-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { update as updateMember } from '@/routes/teams/members';
import { index as teamsRoute, update as updateTeam } from '@/routes/teams';
import type { Team, TeamInvitation, TeamMember, TeamPermissions } from '@/types';

type TeamWithDetails = Team & {
    permissions: TeamPermissions;
    members: TeamMember[];
    invitations: TeamInvitation[];
};

type Props = {
    teams: TeamWithDetails[];
    currentTeam: Team | null;
};

function TeamNameForm({ team }: { team: TeamWithDetails }) {
    const [editing, setEditing] = useState(false);
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: team.name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(updateTeam(team.slug), {
            onSuccess: () => setEditing(false),
        });
    };

    if (!editing) {
        return (
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-lg">{team.name}</span>
                {team.isPersonal && (
                    <Badge variant="secondary">Personal</Badge>
                )}
                {team.isCurrent && (
                    <Badge variant="outline">Current</Badge>
                )}
                {team.permissions.canUpdateTeam && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setEditing(true)}
                    >
                        Rename
                    </Button>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="flex items-start gap-2">
            <div className="flex-1 space-y-1">
                <Input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    autoFocus
                    className="h-8"
                />
                <InputError message={errors.name} />
            </div>
            <Button type="submit" size="sm" disabled={processing}>
                Save
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                    reset();
                    setEditing(false);
                }}
            >
                Cancel
            </Button>
        </form>
    );
}

function MemberRoleSelect({
    team,
    member,
    canUpdateMember,
}: {
    team: TeamWithDetails;
    member: TeamMember;
    canUpdateMember: boolean;
}) {
    const [busy, setBusy] = useState(false);

    const onChange = (role: string) => {
        setBusy(true);
        router.patch(
            updateMember({ team: team.slug, user: member.id }).url,
            { role },
            {
                preserveScroll: true,
                onFinish: () => setBusy(false),
            },
        );
    };

    if (!canUpdateMember || member.role === 'owner') {
        return (
            <span className="text-sm text-muted-foreground">{member.role_label}</span>
        );
    }

    return (
        <Select value={member.role} onValueChange={onChange} disabled={busy}>
            <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
            </SelectContent>
        </Select>
    );
}

function TeamCard({ team }: { team: TeamWithDetails }) {
    const { permissions, members, invitations } = team;

    return (
        <Card>
            <CardHeader className="pb-3">
                <TeamNameForm team={team} />
                <CardDescription className="capitalize">
                    Your role: <strong>{team.role}</strong>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Members */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                            Members ({members.length})
                        </Label>
                        {permissions.canCreateInvitation && (
                            <InviteMemberModal team={team}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 gap-1 text-xs"
                                >
                                    <UserPlus className="size-3" />
                                    Invite
                                </Button>
                            </InviteMemberModal>
                        )}
                    </div>

                    <div className="divide-y rounded-md border">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between px-3 py-2"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {member.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {member.email}
                                    </p>
                                </div>
                                <div className="ml-4 flex shrink-0 items-center gap-2">
                                    <MemberRoleSelect
                                        team={team}
                                        member={member}
                                        canUpdateMember={permissions.canUpdateMember}
                                    />
                                    {permissions.canRemoveMember &&
                                        member.role !== 'owner' && (
                                            <RemoveMemberModal
                                                team={team}
                                                member={member}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                >
                                                    <UserMinus className="size-3.5" />
                                                </Button>
                                            </RemoveMemberModal>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Pending Invitations ({invitations.length})
                        </Label>

                        <div className="divide-y rounded-md border">
                            {invitations.map((inv: TeamInvitation) => (
                                <div
                                    key={inv.code}
                                    className="flex items-center justify-between px-3 py-2"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm">{inv.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {inv.role_label}
                                        </p>
                                    </div>
                                    {permissions.canCancelInvitation && (
                                        <CancelInvitationModal
                                            team={team}
                                            invitation={inv}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ml-4 h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </CancelInvitationModal>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Delete Team */}
                {permissions.canDeleteTeam && (
                    <>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-destructive">
                                    Delete Team
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Permanently delete this team and remove all members.
                                </p>
                            </div>
                            <DeleteTeamModal team={team}>
                                <Button variant="destructive" size="sm">
                                    Delete
                                </Button>
                            </DeleteTeamModal>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default function Teams({ teams }: Props) {
    return (
        <>
            <Head title="Team settings" />

            <h1 className="sr-only">Team settings</h1>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Teams"
                        description="Manage your teams and memberships"
                    />
                    <CreateTeamModal>
                        <Button size="sm" className="gap-1">
                            <Plus className="size-4" />
                            New Team
                        </Button>
                    </CreateTeamModal>
                </div>

                {teams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        You are not a member of any team.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {teams.map((team) => (
                            <TeamCard key={team.id} team={team} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Teams.layout = {
    breadcrumbs: [
        {
            title: 'Team settings',
            href: teamsRoute(),
        },
    ],
};
