'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProfileServiceInstance } from '@/shared/services/profileAxios';
import { useToast } from '@/hooks/use-toast';

const LogoutButton = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await ProfileServiceInstance.logout();
      toast({
        title: 'You registered successfully'
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'An unexpected error occured. Please try again.'
      });
      console.log('error', error);
    }
  };

  return (
    <Button onClick={handleLogout} className="btn btn-logout">
      Выйти
    </Button>
  );
};

export default LogoutButton;
