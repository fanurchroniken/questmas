import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SignUpForm() {
  const { t } = useTranslation();
  
  const signUpSchema = z
    .object({
      fullName: z.string().min(2, t('nameMinLength')).optional(),
      email: z.string().email(t('invalidEmail')),
      password: z.string().min(6, t('passwordMinLength')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsDontMatch'),
      path: ['confirmPassword'],
    });

type SignUpFormData = z.infer<typeof signUpSchema>;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await signUp(data.email, data.password, data.fullName);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {t('accountCreated')}
        </div>
        <p className="text-stormy-sky">{t('redirectingToDashboard')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-stormy-sky mb-2">
          {t('fullName')}
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stormy-sky w-5 h-5" />
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className="input pl-10"
            placeholder="John Doe"
          />
        </div>
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stormy-sky mb-2">
          {t('email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stormy-sky w-5 h-5" />
          <input
            id="email"
            type="email"
            {...register('email')}
            className="input pl-10"
            placeholder="your@email.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stormy-sky mb-2">
          {t('password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stormy-sky w-5 h-5" />
          <input
            id="password"
            type="password"
            {...register('password')}
            className="input pl-10"
            placeholder="••••••••"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-stormy-sky mb-2"
        >
          {t('confirmPassword')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stormy-sky w-5 h-5" />
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="input pl-10"
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        {loading ? t('creatingAccount') : t('signup')}
      </button>

      <p className="text-center text-sm text-stormy-sky">
        {t('alreadyHaveAccount')}{' '}
        <Link to="/login" className="text-deep-teal hover:underline font-medium">
          {t('signInLink')}
        </Link>
      </p>
    </form>
  );
}

