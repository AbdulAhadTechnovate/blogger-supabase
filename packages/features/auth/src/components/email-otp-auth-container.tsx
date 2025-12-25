'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSignInWithOtp } from '@kit/supabase/hooks/use-sign-in-with-otp';
import { useVerifyOtp } from '@kit/supabase/hooks/use-verify-otp';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@kit/ui/input-otp';
import { Trans } from '@kit/ui/trans';

import { useCaptchaToken } from '../captcha/client';
import { TermsAndConditionsFormField } from './terms-and-conditions-form-field';

export function EmailOtpAuthContainer({
  shouldCreateUser,
  defaultValues,
  displayTermsCheckbox,
  onSignIn,
}: {
  shouldCreateUser: boolean;
  displayTermsCheckbox?: boolean;
  onSignIn?: () => unknown;

  defaultValues?: {
    email: string;
  };
}) {
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState<string>(defaultValues?.email ?? '');
  const [otpSent, setOtpSent] = useState(false);

  const signInWithOtpMutation = useSignInWithOtp();
  const verifyOtpMutation = useVerifyOtp();

  const emailForm = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email().transform((val) => val.toLowerCase().trim()),
      }),
    ),
    defaultValues: {
      email: defaultValues?.email?.toLowerCase().trim() ?? '',
    },
  });

  const otpForm = useForm({
    resolver: zodResolver(
      z.object({
        code: z
          .string()
          .min(6, 'Code must be 6 digits')
          .max(6, 'Code must be 6 digits')
          .regex(/^\d+$/, 'Code must contain only numbers')
          .transform((val) => val.trim().replace(/\s/g, '')),
      }),
    ),
    defaultValues: {
      code: '',
    },
  });

  const onSendOtp = async ({ email: emailValue }: { email: string }) => {
    // Normalize email to lowercase to avoid case sensitivity issues
    const normalizedEmail = emailValue.toLowerCase().trim();
    setEmail(normalizedEmail);

    const promise = async () => {
      await signInWithOtpMutation.mutateAsync({
        email: normalizedEmail,
        options: {
          // Don't provide emailRedirectTo to get a 6-digit code instead of magic link
          captchaToken,
          shouldCreateUser,
        },
      });
    };

    toast.promise(promise, {
      loading: t('auth:sendingEmailCode'),
      success: t('auth:sendCodeSuccessToast'),
      error: t('auth:errors.code'),
    });

    resetCaptchaToken();
  };

  const onVerifyOtp = async ({ code }: { code: string }) => {
    try {
      // Trim and normalize the code (remove any spaces)
      const normalizedCode = code.trim().replace(/\s/g, '');
      
      // Ensure email is normalized to lowercase
      const normalizedEmail = email.toLowerCase().trim();

      await verifyOtpMutation.mutateAsync({
        email: normalizedEmail,
        token: normalizedCode,
        type: 'email',
      });

      if (onSignIn) {
        onSignIn();
      } else {
        // Router will handle redirect via auth change listener
        router.refresh();
      }
    } catch (error) {
      // Error is handled by the mutation
      console.error('OTP verification error:', error);
    }
  };

  // After OTP is sent successfully, show OTP input
  useEffect(() => {
    if (signInWithOtpMutation.data && !otpSent) {
      setOtpSent(true);
    }
  }, [signInWithOtpMutation.data, otpSent]);

  // Show OTP input form after email is sent
  if (otpSent) {
    return (
      <Form {...otpForm}>
        <form
          className={'w-full'}
          onSubmit={otpForm.handleSubmit(onVerifyOtp)}
        >
          <If condition={verifyOtpMutation.error}>
            <ErrorAlert error={verifyOtpMutation.error} />
          </If>

          <div className={'flex flex-col space-y-4'}>
            <Alert variant={'success'}>
              <CheckIcon className={'h-4'} />
              <AlertTitle>
                <Trans i18nKey={'auth:sendCodeSuccess'} />
              </AlertTitle>
              <AlertDescription>
                <Trans i18nKey={'auth:sendCodeSuccessDescription'} />
              </AlertDescription>
            </Alert>

            <FormField
              name={'code'}
              render={({ field }) => {
                return (
                  <FormItem
                    className={
                      'mx-auto flex flex-col items-center justify-center'
                    }
                  >
                    <FormLabel>
                      <Trans i18nKey={'auth:verificationCode'} />
                    </FormLabel>

                    <FormControl>
                      <InputOTP {...field} maxLength={6} minLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <FormDescription>
                      <Trans i18nKey={'auth:verificationCodeHint'} />
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button
              disabled={
                verifyOtpMutation.isPending ||
                !otpForm.formState.isValid
              }
            >
              <If
                condition={verifyOtpMutation.isPending}
                fallback={<Trans i18nKey={'auth:verifyCode'} />}
              >
                <Trans i18nKey={'auth:verifyingCode'} />
              </If>
            </Button>

            <div className={'flex flex-col space-y-2'}>
              <Button
                type={'button'}
                variant={'ghost'}
                onClick={async () => {
                  // Resend OTP code
                  setOtpSent(false);
                  signInWithOtpMutation.reset();
                  otpForm.reset();
                  // Automatically resend the code
                  if (email) {
                    await onSendOtp({ email });
                  }
                }}
                disabled={signInWithOtpMutation.isPending}
              >
                <If
                  condition={signInWithOtpMutation.isPending}
                  fallback={<Trans i18nKey={'auth:resendCode'} />}
                >
                  <Trans i18nKey={'auth:resendingCode'} />
                </If>
              </Button>

              <Button
                type={'button'}
                variant={'ghost'}
                onClick={() => {
                  setOtpSent(false);
                  setEmail('');
                  signInWithOtpMutation.reset();
                  otpForm.reset();
                }}
              >
                <Trans i18nKey={'auth:useDifferentEmail'} />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }

  // Show email input form
  return (
    <Form {...emailForm}>
      <form
        className={'w-full'}
        onSubmit={emailForm.handleSubmit(async (data) => {
          setEmail(data.email);
          await onSendOtp(data);
        })}
      >
        <If condition={signInWithOtpMutation.error}>
          <ErrorAlert error={signInWithOtpMutation.error} />
        </If>

        <div className={'flex flex-col space-y-4'}>
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey={'common:emailAddress'} />
                </FormLabel>

                <FormControl>
                  <Input
                    data-test={'email-input'}
                    required
                    type="email"
                    placeholder={t('auth:emailPlaceholder')}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            name={'email'}
          />

          <If condition={displayTermsCheckbox}>
            <TermsAndConditionsFormField />
          </If>

          <Button disabled={signInWithOtpMutation.isPending}>
            <If
              condition={signInWithOtpMutation.isPending}
              fallback={<Trans i18nKey={'auth:sendEmailCode'} />}
            >
              <Trans i18nKey={'auth:sendingEmailCode'} />
            </If>
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ErrorAlert({ error }: { error?: unknown }) {
  const errorMessage =
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : undefined;

  return (
    <Alert variant={'destructive'}>
      <ExclamationTriangleIcon className={'h-4'} />

      <AlertTitle>
        <Trans i18nKey={'auth:errors.generic'} />
      </AlertTitle>

      <AlertDescription>
        {errorMessage ? (
          <>
            <Trans i18nKey={'auth:errors.code'} />
            <br />
            <span className={'text-xs'}>{errorMessage}</span>
          </>
        ) : (
          <Trans i18nKey={'auth:errors.code'} />
        )}
      </AlertDescription>
    </Alert>
  );
}

