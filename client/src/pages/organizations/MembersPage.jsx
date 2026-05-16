import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useOrgMembers, useAddMember, useRemoveMember, useOrganization } from '@/hooks/useOrganizations';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ListSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ArrowLeft, Plus, Trash2, Users, Loader2, X } from 'lucide-react';

export default function MembersPage() {
  const { orgId } = useParams();
  const queryClient = useQueryClient();
  const { data: members, isLoading } = useOrgMembers(orgId);
  const { data: org } = useOrganization(orgId);
  const addMember = useAddMember(orgId);
  const removeMember = useRemoveMember(orgId);
  const isAdmin = org?.userRole === 'admin';
  const [showAdd, setShowAdd] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  // Real-time member sync
  useEffect(() => {
    if (!orgId) return;

    const channel = supabase
      .channel(`org_members_${orgId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_members',
          filter: `organization_id=eq.${orgId}`
        },
        (payload) => {
          console.log('Real-time member change detected:', payload);
          queryClient.invalidateQueries(['organization_members', orgId]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, queryClient]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addMember.mutateAsync({ email, role });
      setShowAdd(false);
      setEmail('');
      setRole('member');
      toast.success(`Invite sent! We've sent an invitation email to ${email} via Henwork.`, { duration: 6000 });
    } catch (err) {
      toast.error(err.message || "Failed to send invitation", { duration: 4000 });
    }
  };

  const handleRemove = (memberId) => {
    toast.warning('Remove this member?', {
      action: {
        label: 'Remove',
        onClick: async () => {
          try {
            await removeMember.mutateAsync(memberId);
            toast.success('Member removed');
          } catch (err) {
            toast.error(err.message || 'Failed to remove member', { duration: 4000 });
          }
        }
      },
      cancel: { label: 'Cancel' }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to={`/org/${orgId}`} className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text">Members</h1>
          <p className="text-text-secondary text-sm">View team members and roles</p>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Member
          </Button>
        )}
      </div>

      {/* Add Member Form */}
      {showAdd && (
        <Card className="border-primary/30 animate-fade-in">
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">Invite by Email</p>
                <button type="button" onClick={() => setShowAdd(false)} className="text-text-muted hover:text-text"><X className="h-4 w-4" /></button>
              </div>
              <div className="flex gap-3">
                <Input placeholder="user@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus className="flex-1" />
                <select value={role} onChange={(e) => setRole(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <Button type="submit" size="sm" disabled={addMember.isPending}>
                  {addMember.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Invite'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardContent>
          {isLoading ? <ListSkeleton rows={4} /> : !members?.length ? (
            <EmptyState icon={Users} title="No members" description="Invite team members to collaborate" />
          ) : (
            <div className="divide-y divide-border">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar firstName={m.firstName} lastName={m.lastName} src={m.profile_picture_url} />
                    <div>
                      <p className="text-sm font-medium text-text">
                        {m.firstName} {m.lastName}
                      </p>
                      <p className="text-xs text-text-muted">{m.email || m.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.role === 'admin' ? 'default' : 'outline'}>{m.role}</Badge>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => handleRemove(m.id)}
                        className="h-8 w-8 text-text-muted hover:text-destructive" title="Remove member">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
