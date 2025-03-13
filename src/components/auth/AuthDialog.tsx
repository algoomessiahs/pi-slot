
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        {mode === 'signin' ? (
          <SignInForm onToggleMode={() => setMode('signup')} onClose={() => onOpenChange(false)} />
        ) : (
          <SignUpForm onToggleMode={() => setMode('signin')} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
