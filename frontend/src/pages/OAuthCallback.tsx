import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      navigate('/login?error=oauth_failed');
      return;
    }

    api.post('/api/auth/set-cookie', { token })
      .then(() => {
        window.location.href = '/';
      })
      .catch(() => {
        navigate('/login?error=oauth_failed');
      });
  }, [navigate]);

  return <LoadingScreen />;
}
