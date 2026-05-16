import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass animate-fade-in text-center">
        <CardContent className="pt-8 pb-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-success-muted flex items-center justify-center">
              <MailCheck className="h-8 w-8 text-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Check your email</h2>
          <p className="text-text-secondary mb-8">
            We&apos;ve sent you a confirmation link. Please verify your email to get started.
          </p>
          <Button asChild variant="outline">
            <Link to="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
