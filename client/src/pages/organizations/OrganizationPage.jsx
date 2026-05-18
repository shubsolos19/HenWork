import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useOrganization, useUpdateOrg, useDeleteOrg, useOrgMembers } from '@/hooks/useOrganizations';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { CardSkeleton } from '@/components/shared/LoadingSkeleton';
import { Avatar } from '@/components/ui/avatar';
import { FolderKanban, Plus, Users, ArrowRight, Loader2, X, Settings, Trash2 } from 'lucide-react';

export default function OrganizationPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: org, isLoading: orgLoading } = useOrganization(orgId);
  const { data: members, isLoading: membersLoading } = useOrgMembers(orgId);
  const { data: projects, isLoading: projLoading } = useProjects(orgId);
  const { user } = useAuth();
  const createProject = useCreateProject(orgId);
  const updateOrg = useUpdateOrg(orgId);
  const deleteOrg = useDeleteOrg(orgId);
  const showToast = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Real-time member sync
  useEffect(() => {
    if (!orgId) return;

    const channel = supabase
      .channel(`org_page_members_${orgId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_members',
          filter: `organization_id=eq.${orgId}`
        },
        (payload) => {
          console.log('Real-time member change detected on Org Page:', payload);
          queryClient.invalidateQueries(['organization_members', orgId]);
          queryClient.invalidateQueries(['organization', orgId]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, queryClient]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const proj = await createProject.mutateAsync({ name, description: desc });
      showToast({
        type: 'success',
        title: 'Project Created',
        message: `Successfully set up project: ${name}`
      });
      setShowCreate(false);
      setName('');
      setDesc('');
      navigate(`/project/${proj.id}?orgId=${orgId}`);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Project Creation Failed',
        message: err.message || 'Failed to create project',
        duration: 4000
      });
    }
  };

  const handleEditOpen = () => {
    setEditName(org?.name || '');
    setEditDesc(org?.description || '');
    setShowEdit(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrg.mutateAsync({ name: editName, description: editDesc });
      showToast({
        type: 'success',
        title: 'Workspace Updated',
        message: 'Organization details updated successfully!'
      });
      setShowEdit(false);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to update organization',
        duration: 4000
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrg.mutateAsync();
      showToast({
        type: 'success',
        title: 'Organization Deleted',
        message: 'The organization workspace was successfully removed.'
      });
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err.message || 'Failed to delete organization',
        duration: 4000
      });
    }
  };

  if (orgLoading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text">{org?.name}</h1>
            {user?.id === org?.owner_id && (
              <Button variant="ghost" size="icon" onClick={handleEditOpen} className="h-8 w-8 text-white hover:text-text" title="Edit Organization">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
          {org?.description && <p className="text-white mt-1">{org.description}</p>}
          <div className="flex items-center gap-3 mt-2">
            <Badge
              variant={org?.userRole === 'admin' ? 'default' : 'outline'}
              className={org?.userRole !== 'admin' ? 'bg-white text-black border-none font-semibold capitalize px-2.5 py-0.5' : ''}
            >
              {org?.userRole}
            </Badge>
            <span className="text-sm text-white">{org?.memberCount} member{org?.memberCount !== 1 ? 's' : ''}</span>
            {/* Member Avatars */}
            {org?.userRole === 'admin' && members && members.length > 0 && (
              <div className="flex -space-x-2 ml-2">
                {members.slice(0, 3).map((m) => (
                  <div key={m.id} className="relative group cursor-pointer">
                    <Avatar
                      firstName={m.firstName}
                      lastName={m.lastName}
                      src={m.profile_picture_url}
                      size="sm"
                      className="h-8 w-8 border-2 border-surface shrink-0"
                    />
                    <div className="glass absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50 whitespace-nowrap px-2 py-1 text-xs">
                      <span className="font-medium text-text">
                        {m.firstName} {m.lastName}
                      </span>
                      <span className="text-white ml-1 capitalize">({m.role})</span>
                    </div>
                  </div>
                ))}
                {members.length > 3 && (
                  <div className="relative group cursor-pointer z-10 shrink-0">
                    <div className="glass h-8 w-8 flex items-center justify-center text-[10px] font-bold text-white">
                      +{members.length - 3}
                    </div>
                    <div className="glass absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50 whitespace-nowrap px-2 py-1.5 text-xs max-h-48 overflow-y-auto custom-scrollbar">
                      {members.slice(3).map((rm) => (
                        <div key={rm.id} className="mb-1 last:mb-0">
                          <span className="font-medium text-text">{rm.firstName} {rm.lastName}</span>
                          <span className="text-text-muted ml-1 capitalize">({rm.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/org/${orgId}/members`}><Users className="h-4 w-4 mr-1" /> Members</Link>
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1" /> Project
          </Button>
        </div>
      </div>

      {/* Edit Organization Form */}
      {showEdit && (
        <Card className="border-primary/30 animate-fade-in">
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">Edit Organization</p>
                <button type="button" onClick={() => setShowEdit(false)} className="text-text-muted hover:text-text"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3">
                <Input placeholder="Organization name" value={editName} onChange={(e) => setEditName(e.target.value)} required autoFocus />
                <textarea placeholder="Description (optional)" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                  className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px] resize-none transition-colors" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={deleteOrg.isPending}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete Org
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowEdit(false)}>Cancel</Button>
                  <Button type="submit" size="sm" disabled={updateOrg.isPending}>
                    {updateOrg.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Create Project Form */}
      {showCreate && (
        <Card className="border-primary/30 animate-fade-in">
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">New Project</p>
                <button type="button" onClick={() => setShowCreate(false)} className="text-white hover:text-text"><X className="h-4 w-4" /></button>
              </div>
              <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
              <textarea placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)}
                className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px] resize-none transition-colors" />
              <Button type="submit" size="sm" disabled={createProject.isPending}>
                {createProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      {projLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : !projects?.length ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to start managing tasks" actionLabel="Create Project" onAction={() => setShowCreate(true)} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <Link key={proj.id} to={`/project/${proj.id}?orgId=${orgId}`}>
              <Card className="hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group cursor-pointer h-full">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                      <FolderKanban className="h-4 w-4 text-accent" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-medium text-text group-hover:text-primary transition-colors">{proj.name}</h3>
                  {proj.description && <p className="text-sm text-white mt-1 line-clamp-2">{proj.description}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
