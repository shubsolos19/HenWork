import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Loader2, Upload, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
      });
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        first_name: form.firstName,
        last_name: form.lastName,
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return toast.error('Only JPG and PNG images are allowed.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB.');
    }

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile.mutateAsync({ profile_picture_url: publicUrl });
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePicture = async () => {
    try {
      await updateProfile.mutateAsync({ profile_picture_url: null });
      toast.success('Profile picture removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove picture');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text">Profile Settings</h1>
        <p className="text-sm text-white mt-1">Manage your public profile and personal details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar
            firstName={profile?.first_name}
            lastName={profile?.last_name}
            src={profile?.profile_picture_url}
            size="2xl"
          />
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Upload New
              </Button>
              {profile?.profile_picture_url && (
                <Button variant="outline" onClick={handleRemovePicture} disabled={uploading}>
                  <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-white">JPG or PNG. Max size 5MB.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">First Name</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Last Name</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Email Address</label>
              <Input value={user?.email || ''} disabled className="opacity-50" />
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
