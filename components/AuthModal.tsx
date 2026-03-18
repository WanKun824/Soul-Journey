import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, X, Loader2, User as UserIcon } from 'lucide-react';
import { signIn, signUp, signInWithGoogle } from '../services/auth';
import { useToast } from './Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('请输入邮箱和密码', 'error');
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        showToast('登录成功', 'success');
        onSuccess();
        onClose();
      } else {
        await signUp(email, password);
        showToast('注册成功！请前往邮箱查收确认邮件。', 'success');
        setIsLogin(true); // Switch to login after successful registration signups
      }
    } catch (err: any) {
      console.error('Auth Error', err);
      let errMsg = err.message || '认证失败，请重试';
      if (errMsg.includes('Invalid login credentials')) errMsg = '密码错误或账户未注册';
      else if (errMsg.includes('already registered')) errMsg = '该邮箱已注册，请直接登录';
      else if (errMsg.includes('Email not confirmed')) errMsg = '请先前往邮箱点击确认链接';
      else if (errMsg.includes('Password should be at least')) errMsg = '密码长度不能少于 6 位';
      
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Supabase OAuth will redirect the page, so no need to manage local state post-click
    } catch (err: any) {
      showToast(err.message || 'Google 登录失败', 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment key="auth-modal">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm glass-panel p-8 relative rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(30,15,40,0.8), rgba(15,10,30,0.9))' }}
            >
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                  <UserIcon className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-light text-white tracking-widest">
                  {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                </h2>
                <p className="text-white/40 text-sm mt-2">
                  {isLogin ? '登录以匹配你的灵魂伴侣' : '注册加入灵魂宇宙'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-neutral-200 font-medium rounded-xl py-3 mt-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {isLogin ? '登录中...' : '注册中...'}</>
                  ) : (
                    isLogin ? '登录' : '注册'
                  )}
                </button>
              </form>

              <div className="mt-5 flex items-center gap-4">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-white/30 text-xs">or continue with</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full mt-5 bg-black/40 border border-white/10 hover:border-white/30 text-white font-medium rounded-xl py-3 transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
