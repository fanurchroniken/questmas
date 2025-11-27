import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LoginForm() {
  const { t } = useTranslation();
  
  const loginSchema = z.object({
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(6, t('passwordMinLength')),
  });

type LoginFormData = z.infer<typeof loginSchema>;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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

      <div className="flex items-center justify-between">
        <Link
          to="/forgot-password"
          className="text-sm text-deep-teal hover:underline"
        >
          {t('forgotPassword')}
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        {loading ? t('signingIn') : t('login')}
      </button>

      <p className="text-center text-sm text-stormy-sky">
        {t('dontHaveAccount')}{' '}
        <Link to="/signup" className="text-deep-teal hover:underline font-medium">
          {t('signUpLink')}
        </Link>
      </p>
    </form>
  );
}

