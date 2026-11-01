/**
 * Página /auth/sso — ERP Oraqui
 * Recebe handoff SSO da Central de Licenças (?token=<sso>&lt=<license>)
 * e chama o backend POST /api/licenca/sso/bootstrap para vincular/criar conta.
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';

export function SsoPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'requires_login'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleSSO() {
      const token = searchParams.get('token');
      const licenseToken = searchParams.get('lt');

      if (!token || !licenseToken) {
        setError('Parâmetros token/lt ausentes na URL');
        setStatus('error');
        return;
      }

      try {
        const response = await api.post('/api/licenca/sso/bootstrap', {
          token,
          licenseToken
        });

        const data = response.data;

        if (data.requerLogin) {
          setStatus('requires_login');
          localStorage.setItem('pendingLicenseToken', licenseToken);
          setTimeout(() => navigate('/login?returnTo=/dashboard'), 1500);
        } else {
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Falha no bootstrap SSO');
        setStatus('error');
      }
    }

    handleSSO();
  }, [searchParams, navigate]);

  const messages = {
    loading: 'Vinculando sua licença...',
    success: 'Licença vinculada com sucesso! Redirecionando...',
    requires_login: 'Conta existente detectada. Redirecionando para login...',
    error: `Erro: ${error}`
  };

  const colors = {
    loading: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    requires_login: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          {status === 'loading' && (
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {status === 'success' && <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          {status === 'requires_login' && <svg className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          {status === 'error' && <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
        </div>
        <p className={`text-lg font-medium ${colors[status]} dark:text-gray-200`}>
          {messages[status]}
        </p>
        {status === 'error' && (
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Voltar à Central de Licenças
          </button>
        )}
      </div>
    </div>
  );
}

export default SsoPage;
