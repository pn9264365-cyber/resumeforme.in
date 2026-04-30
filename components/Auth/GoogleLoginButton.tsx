import React from 'react';
import { signInWithGoogle, logout } from '../../services/firebase';
import { LogInIcon, LogOutIcon } from '../ui/Icons';

interface GoogleLoginButtonProps {
  user: any;
  loading?: boolean;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ user, loading }) => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert('Failed to sign out. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg animate-pulse">
        <div className="w-5 h-5 bg-gray-200 rounded-full" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-6 h-6 rounded-full border border-gray-200"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="text-xs font-bold text-gray-700 hidden sm:inline">
            {user.displayName?.split(' ')[0]}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          title="Sign Out"
        >
          <LogOutIcon size={18} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-lg transition shadow-sm active:scale-95 text-sm"
    >
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google logo" 
        className="w-4 h-4"
      />
      <span>Continue with Google</span>
    </button>
  );
};
