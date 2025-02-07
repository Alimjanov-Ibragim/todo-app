'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { profileSchema } from '@/app/validationSchemas';
import { ProfileServiceInstance } from '@/shared/services/profileAxios';
import { TProfile } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TProfile>({
    defaultValues: {
      email: '',
      password: '',
      name: ''
    },
    resolver: zodResolver(profileSchema)
  });

  const onSubmit: SubmitHandler<TProfile> = async data => {
    try {
      setIsSubmitting(true);
      await ProfileServiceInstance.registerUser(data);
      setIsSubmitting(false);
      toast({
        title: 'You registered successfully'
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'An unexpected error occured. Please try again.'
      });
      setIsSubmitting(false);
      console.log('error', error);
    }
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[400px] mx-auto p-4">
      <h1 className="font-bold">Registration</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[10px]"
      >
        <Input {...register('name')} placeholder="Your name" />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

        <Input {...register('email')} placeholder="Your email" />
        <ErrorMessage>{errors.email?.message}</ErrorMessage>

        <Input {...register('password')} placeholder="Your password" />
        <ErrorMessage>{errors.password?.message}</ErrorMessage>

        <Button type="submit" disabled={isSubmitting}>
          Register {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
}
