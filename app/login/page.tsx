'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/app/components';
import { Spinner } from '@/app/components';
import { profileSchemaWithoutName } from '@/app/validationSchemas';
import { TProfileWithoutName } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TProfileWithoutName>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(profileSchemaWithoutName)
  });

  const onSubmit: SubmitHandler<TProfileWithoutName> = async data => {
    try {
      setIsSubmitting(true);
      await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      });
      setIsSubmitting(false);
      toast({
        title: 'You logged in successfully'
      });
      router.push('/todos');
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
      <h1 className="font-bold">Logging in</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[10px]"
      >
        <Input {...register('email')} placeholder="Your email" />
        <ErrorMessage>{errors.email?.message}</ErrorMessage>

        <Input {...register('password')} placeholder="Your password" />
        <ErrorMessage>{errors.password?.message}</ErrorMessage>

        <Button type="submit" disabled={isSubmitting}>
          LogIn {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
}
