import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOrg } from '@/hooks/useOrganizations';
import { useToast } from '@/hooks/useToast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Loader2, ArrowLeft } from 'lucide-react';

export default function NewOrgPage() {
  const navigate = useNavigate();
  const createOrg = useCreateOrg();
  const showToast = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const org = await createOrg.mutateAsync({ name, description });
      showToast({
        type: 'success',
        title: 'Organization Created',
        message: `Successfully set up workspace: ${name}`
      });
      setTimeout(() => {
        navigate(`/org/${org.id}`);
      }, 100);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Workspace Creation Failed',
        message: err.message || 'Failed to create organization',
        duration: 4000
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card className="glass">
        <CardHeader>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>Set up a new team to manage projects and tasks together.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Organization Name</label>
              <Input placeholder="Acme Inc." value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} autoFocus />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Description <span className="text-text-muted">(optional)</span></label>
              <textarea placeholder="What does this team do?"
                value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000}
                className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none transition-colors" />
            </div>
            <Button type="submit" className="w-full" disabled={createOrg.isPending}>
              {createOrg.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : 'Create Organization'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
