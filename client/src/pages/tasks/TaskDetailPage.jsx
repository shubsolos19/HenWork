import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTask, useUpdateTask, useDeleteTask, useAssignUser, useUnassignUser } from '@/hooks/useTasks';
import { useComments, useAddComment, useDeleteComment } from '@/hooks/useComments';
import { useTaskAttachments, useUploadAttachment, useDeleteAttachment } from '@/hooks/useAttachments';
import { useOrgMembers, useOrganization } from '@/hooks/useOrganizations';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ListSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { getStatusLabel, getPriorityColor, formatDate, formatRelative, isOverdue, cn } from '@/lib/utils';
import {
  ArrowLeft, Calendar, Flag, Clock, Trash2, Loader2,
  MessageSquare, Send, CheckCircle2, Paperclip, Download, File, X, HardDrive, Plus,
  Users, UserPlus
} from 'lucide-react';
import { attachmentService } from '@/services/attachments.service';

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const orgId = searchParams.get('orgId');
  const from = searchParams.get('from');
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: task, isLoading } = useTask(taskId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const { data: comments, isLoading: commentsLoading } = useComments(taskId);
  const addComment = useAddComment(taskId);
  const delComment = useDeleteComment(taskId);

  // Attachments
  const { data: attachments, isLoading: attachmentsLoading } = useTaskAttachments(taskId);
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();

  const [commentText, setCommentText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  const { data: orgMembers } = useOrgMembers(orgId);
  const { data: org } = useOrganization(orgId);
  const assignUser = useAssignUser(taskId, projectId);
  const unassignUser = useUnassignUser(taskId, projectId);

  const isAdmin = org?.userRole === 'admin';
  const isCreator = task?.created_by_id === user?.id;
  const canManage = isAdmin || isCreator;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Check total size (25MB)
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 25 * 1024 * 1024) {
      toast.error('Total file size must be less than 25MB');
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        await uploadAttachment.mutateAsync({ orgId, projectId, taskId, file });
        successCount++;
      } catch (err) {
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)`);
    }
    e.target.value = ''; // Reset input
  };

  const handleDownload = async (attachmentId) => {
    try {
      const { url, fileName } = await attachmentService.getDownloadUrl(attachmentId);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error('Failed to generate download link');
    }
  };

  if (isLoading) return <div className="max-w-3xl mx-auto"><ListSkeleton rows={6} /></div>;

  const statusOptions = [
    { value: 'todo', label: 'To Do', icon: Clock, color: 'text-white' },
    { value: 'in_progress', label: 'In Progress', icon: Loader2, color: 'text-warning' },
    { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-success' },
  ];

  const handleStatusChange = (status) => {
    updateTask.mutate({ taskId, status }, {
      onSuccess: () => toast.success('Status updated'),
      onError: (err) => toast.error(err.message || 'Failed to update status', { duration: 4000 })
    });
  };

  const handlePriorityChange = (priority) => {
    updateTask.mutate({ taskId, priority }, {
      onSuccess: () => toast.success('Priority updated'),
      onError: (err) => toast.error(err.message || 'Failed to update priority', { duration: 4000 })
    });
  };

  const handleDelete = () => {
    toast.warning('Are you sure? This cannot be undone.', {
      duration: Infinity,
      action: {
        label: 'Delete Task',
        onClick: async () => {
          try {
            await deleteTask.mutateAsync(taskId);
            toast.success('Task deleted');
            navigate((from === 'dashboard' || !orgId) ? '/dashboard' : `/project/${projectId}?orgId=${orgId}`);
          } catch (err) {
            toast.error(err.message || 'Failed to delete task', { duration: 4000 });
          }
        }
      },
      cancel: { label: 'Cancel' }
    });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment.mutateAsync(commentText.trim());
      setCommentText('');
    } catch (err) {
      toast.error(err.message || 'Failed to add comment', { duration: 4000 });
    }
  };

  const handleAssign = async (userId) => {
    try {
      await assignUser.mutateAsync(userId);
      toast.success('Member assigned');
    } catch (err) {
      toast.error(err.message || 'Failed to assign member');
    }
  };

  const handleUnassign = async (userId) => {
    try {
      await unassignUser.mutateAsync(userId);
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fade-in">
      {/* Back */}
      <Link to={(from === 'dashboard' || !orgId) ? '/dashboard' : `/project/${projectId}?orgId=${orgId}`}
        className="inline-flex items-center gap-1.5 text-sm text-white transition-colors group">
        <ArrowLeft className="h-4 w-4 text-white group-hover:-translate-x-0.5 transition-transform" /> Back to {from === 'dashboard' || !orgId ? 'dashboard' : 'project'}
      </Link>

      {/* Task Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight break-words">{task?.title}</h1>
        {task?.description && (
          <p className="text-white text-sm sm:text-base leading-relaxed max-w-2xl break-words">{task.description}</p>
        )}
      </div>

      {/* Assigned To */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Assigned To
              {task?.assignees?.length > 0 && <span className="text-xs text-text-muted">({task.assignees.length})</span>}
            </CardTitle>
            {canManage && (
              <Button size="sm" variant="outline" onClick={() => setShowMemberSelector(!showMemberSelector)}>
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                {showMemberSelector ? 'Close' : 'Manage'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showMemberSelector && (
            <div className="glass mb-4 p-3 space-y-3">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Team Members</p>
              <div className="grid gap-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {orgMembers?.map(member => {
                  const isAssigned = task?.assignees?.some(a => a.user_id === member.user_id);
                  return (
                    <div key={member.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-surface/50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={member.profile?.avatar_url}
                          firstName={member.profile?.first_name}
                          lastName={member.profile?.last_name}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-text">
                            {member.profile?.first_name} {member.profile?.last_name}
                          </span>
                          <span className="text-[10px] text-text-muted capitalize">{member.role}</span>
                        </div>
                      </div>
                      <Button
                        size="xs"
                        variant={isAssigned ? "ghost" : "outline"}
                        className={cn(
                          "h-7 px-3 text-xs",
                          isAssigned ? "text-destructive hover:bg-destructive/10" : "bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                        )}
                        onClick={() => isAssigned ? handleUnassign(member.user_id) : handleAssign(member.user_id)}
                        disabled={assignUser.isPending || unassignUser.isPending}
                      >
                        {isAssigned ? "Remove" : "Assign"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!task?.assignees?.length ? (
            <div className="glass flex flex-col items-center justify-center py-6 text-center border-dashed">
              <Users className="h-6 w-6 text-text-muted mb-2 opacity-30" />
              <p className="text-xs text-text-muted font-medium">No one assigned yet</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {task.assignees.map((asgn) => (
                <div key={asgn.id} className="glass flex items-center gap-2 p-1 pr-3 rounded-full">
                  <Avatar
                    src={asgn.profile?.avatar_url}
                    firstName={asgn.profile?.first_name}
                    lastName={asgn.profile?.last_name}
                    size="sm"
                    className="h-6 w-6"
                  />
                  <span className="text-xs font-medium text-text">
                    {asgn.profile?.first_name} {asgn.profile?.last_name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Properties */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {/* Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 first:pt-4">
            <span className="text-sm font-medium text-white shrink-0">Status</span>
            <div className="flex flex-wrap gap-1.5">
              {statusOptions.map((opt) => (
                <button key={opt.value} onClick={() => handleStatusChange(opt.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    task?.status === opt.value
                      ? 'bg-surface-hover border-border-bright ' + opt.color
                      : 'border-transparent text-white hover:bg-surface-hover'
                  )}>
                  <opt.icon className="h-3.5 w-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
            <span className="text-sm font-medium text-white shrink-0">Priority</span>
            <div className="flex flex-wrap gap-1.5">
              {['low', 'medium', 'high'].map((p) => {
                const isSelected = task?.priority === p;
                let colorClass = getPriorityColor(p);
                if (p === 'high' && isSelected) {
                  colorClass = colorClass.replace('text-destructive', 'text-[#ff0000]');
                }
                return (
                  <button key={p} onClick={() => handlePriorityChange(p)}
                    className={cn(
                      'px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize border',
                      isSelected
                        ? colorClass + ' border-current/20'
                        : 'border-transparent text-white hover:bg-surface-hover'
                    )}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium text-white">Due Date</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white" />
              <span className={cn('text-sm font-medium', (task?.due_date || task?.dueDate) && isOverdue(task.due_date || task.dueDate) && task.status !== 'completed' ? 'text-[#ff0000]' : 'text-white')}>
                {(task?.due_date || task?.dueDate) ? formatDate(task.due_date || task.dueDate) : 'No due date'}
              </span>
            </div>
          </div>

          {/* Created */}
          <div className="flex items-center justify-between p-4 last:pb-4">
            <span className="text-sm font-medium text-white">Created</span>
            <span className="text-sm text-white">{formatRelative(task?.created_at)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Paperclip className="h-4 w-4" />
              Attachments
              {attachments?.length > 0 && <span className="text-xs text-text-muted">({attachments.length})</span>}
            </CardTitle>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              <Button size="sm" variant="outline" asChild disabled={isUploading}>
                <label htmlFor="file-upload" className="cursor-pointer">
                  {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Plus className="h-3.5 w-3.5 mr-1.5" />}
                  Attach Files
                </label>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {attachmentsLoading ? <ListSkeleton rows={2} /> : !attachments?.length ? (
            <div className="glass flex flex-col items-center justify-center py-6 text-center border-2 border-dashed">
              <HardDrive className="h-8 w-8 text-text-muted mb-2 opacity-50" />
              <p className="text-sm text-text-secondary font-medium">No files attached</p>
              <p className="text-xs text-text-muted mt-1">Upload documents or images up to 25MB</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {attachments.map((file) => {
                const fileExtension = file.file_name.split('.').pop()?.toUpperCase() || 'FILE';
                const shortType = file.content_type?.split('/')[1]?.toUpperCase() || fileExtension;
                const displayType = shortType.length > 5 ? fileExtension : shortType;

                return (
                  <div key={file.id} className="glass flex items-center gap-3 p-3 transition-all group overflow-hidden">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text truncate" title={file.file_name}>{file.file_name}</p>
                        <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal opacity-70 shrink-0">
                          {displayType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5 truncate">
                        <span className="shrink-0">{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span className="truncate">By {file.uploader?.first_name} {file.uploader?.last_name}</span>
                        <span className="shrink-0">•</span>
                        <span className="shrink-0">{formatDate(file.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(file.id)} title="Download">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      {(file.uploaded_by === user?.id || task?.role === 'admin') && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                          onClick={() => deleteAttachment.mutate(file.id)} title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            Comments
            {comments?.length > 0 && <span className="text-xs text-text-muted">({comments.length})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment list */}
          {commentsLoading ? <ListSkeleton rows={3} /> : !comments?.length ? (
            <p className="text-sm text-white text-center py-4">No comments yet. Start the conversation!</p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 group">
                  <Avatar
                    src={c.profile_picture_url}
                    firstName={c.user_full_name?.split(' ')[0]}
                    lastName={c.user_full_name?.split(' ')[1] || ''}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text">{c.user_full_name}</span>
                      <span className="text-xs text-text-muted">{formatRelative(c.created_at)}</span>
                      {c.user_id === user?.id && (
                        <button onClick={() => delComment.mutate(c.id)}
                          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-destructive transition-all ml-auto">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5 whitespace-pre-wrap">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add comment */}
          <form onSubmit={handleComment} className="flex gap-2 pt-2 border-t border-border">
            <Input placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)}
              className="flex-1" />
            <Button type="submit" size="icon" disabled={!commentText.trim() || addComment.isPending}
              className="bg-[#000000] hover:bg-[#000000]/90 text-white transition-colors">
              {addComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Task */}
      <Card className="border-destructive/20">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">Delete Task</p>
              <p className="text-xs text-text-muted">This action cannot be undone</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteTask.isPending}>
              <Trash2 className="h-3.5 w-3.5 mr-1" /> {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
