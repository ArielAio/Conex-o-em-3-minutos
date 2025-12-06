import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Heart, ArrowRight, AlertTriangle, Copy, Check } from 'lucide-react';
import { createAccountWithEmail, loginWithEmail } from '../services/firebase';
import { translateAuthError } from '../services/firebaseErrors';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../services/i18n/language';

interface OnboardingProps {
    onComplete: (name: string, partnerName: string, mode: 'solo' | 'couple' | 'distance') => void;
    initialAuthMode?: 'choice' | 'signup' | 'signin';
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialAuthMode = 'choice' }) => {
    const { language } = useLanguage();
    const t = (pt: string, en: string) => (language === 'en' ? en : pt);
    const [step, setStep] = useState<number | 'modeConfirm'>(0); // 0 = Welcome/Login, 1 = My Name, 2 = Partner Name, modeConfirm = pós signup
    const [name, setName] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [mode, setMode] = useState<'solo' | 'couple' | 'distance' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'choice' | 'signup' | 'signin'>(initialAuthMode);
    const [authLoading, setAuthLoading] = useState(false);
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signinEmail, setSigninEmail] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<{title: string, detail: string, domain?: string} | null>(null);
    const [copied, setCopied] = useState(false);

    const copyDomain = () => {
        if (errorMsg?.domain) {
            navigator.clipboard.writeText(errorMsg.domain);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    useEffect(() => {
        setAuthMode(initialAuthMode);
    }, [initialAuthMode]);

    const handleStartGuest = () => {
        setAuthMode('choice');
        if (!mode) {
            setStep(1);
            return;
        }
        setStep(1);
    };

    const handleNext = () => {
        if (step === 1 && name) {
            if (mode === 'solo') {
                onComplete(name, 'Minha jornada', 'solo');
            } else {
                setStep(2);
            }
        }
        else if (step === 2 && partnerName && mode) {
          onComplete(name, partnerName, mode === 'distance' ? 'distance' : 'couple');
        }
    };

    const handleModeAfterSignup = (selected: 'solo' | 'couple' | 'distance') => {
        setMode(selected);
        if (!name.trim()) return;
        if (selected === 'solo') {
            onComplete(name.trim(), 'Minha jornada', 'solo');
        } else if (selected === 'couple') {
            setStep(2);
        } else {
            setStep(2);
        }
    };

    const handleCreateAccount = async () => {
        if (!signupEmail.trim() || !signupPassword.trim() || !signupUsername.trim()) {
            setErrorMsg({
                title: "Preencha tudo",
                detail: "Precisamos de e-mail, senha e nome de usuário para criar sua conta."
            });
            return;
        }
        setAuthLoading(true);
        setErrorMsg(null);
        try {
            await createAccountWithEmail(signupEmail.trim(), signupPassword.trim(), signupUsername.trim());
            const normalizedName = signupUsername.trim();
            setName(normalizedName);
            setStep('modeConfirm'); // força escolher Solo/Casal antes de entrar
            setMode(null);
            setAuthMode('choice');
        } catch (error: any) {
            console.error("Erro ao criar conta:", error);
            const translated = translateAuthError(error, 'criar conta');
            setErrorMsg(translated);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleEmailLogin = async () => {
        if (!signinEmail.trim() || !signinPassword.trim()) {
            setErrorMsg({
                title: "Informe e-mail e senha",
                detail: "Precisamos desses dados para buscar sua conta."
            });
            return;
        }
        setAuthLoading(true);
        setErrorMsg(null);
        try {
            const loggedUser = await loginWithEmail(signinEmail.trim(), signinPassword.trim());
            if (loggedUser?.displayName) {
                setName(loggedUser.displayName);
            }
            setStep(1);
            setAuthMode('choice');
        } catch (error: any) {
            console.error("Erro ao entrar:", error);
            const translated = translateAuthError(error, 'entrar');
            setErrorMsg(translated);
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 pb-safe pt-safe px-safe animate-fade-in">
            <div className="w-full max-w-md app-shell">
                <div className="flex justify-center mb-4">
                    <LanguageSelector emphasize />
                </div>
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-4 rounded-full shadow-lg shadow-brand-primary/20">
                         <Heart className="w-10 h-10 text-brand-primary fill-brand-primary animate-pulse-slow" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 text-center card-padding rounded-surface card-float soft-hover transition-all duration-300">
                    
                    {step === 0 && (
                        <div className="animate-slide-up space-y-4">
                            <h1 className="font-serif heading-md mb-2 text-brand-text leading-tight">
                              {t('Bem-vindo(a)', 'Welcome')}
                            </h1>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                {authMode === 'signin'
                                  ? t('Entre na sua conta para continuar de onde parou.', 'Sign in to continue where you left off.')
                                  : t('Escolha como quer viver a jornada: sozinho(a), em casal presencial ou à distância. Você pode ajustar depois no perfil.',
                                  'Choose how you want to experience the journey: solo, in-person couple, or long-distance. You can adjust later in the profile.')}
                            </p>

                            {authMode !== 'signin' && (
                              <div className="grid grid-cols-3 gap-2 text-left mb-6">
                                  <button
                                    onClick={() => setMode('solo')}
                                    className={`p-3 rounded-xl border ${mode === 'solo' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'} text-sm transition-all`}
                                  >
                                    <p className="font-semibold text-brand-text">{t('Solo', 'Solo')}</p>
                                    <p className="text-xs text-gray-500">{t('Autocuidado, comunicação futura, presença consigo.', 'Self-care, future communication, presence with yourself.')}</p>
                                  </button>
                                  <button
                                    onClick={() => setMode('couple')}
                                    className={`p-3 rounded-xl border ${mode === 'couple' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'} text-sm transition-all`}
                                  >
                                    <p className="font-semibold text-brand-text">{t('Casal', 'Couple')}</p>
                                    <p className="text-xs text-gray-500">{t('Rituais a dois, redução de ruídos, alinhamento diário.', 'Rituals for two, less noise, daily alignment.')}</p>
                                  </button>
                                  <button
                                    onClick={() => setMode('distance')}
                                    className={`p-3 rounded-xl border ${mode === 'distance' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'} text-sm transition-all`}
                                  >
                                    <p className="font-semibold text-brand-text">{t('Casal à distância', 'Long-distance couple')}</p>
                                    <p className="text-xs text-gray-500">{t('Chamadas, áudios e rituais remotos.', 'Calls, audio, and remote rituals.')}</p>
                                  </button>
                              </div>
                            )}
                            
                            {errorMsg && (
                                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-left mb-2">
                                    <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase mb-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errorMsg.title}
                                    </div>
                                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{errorMsg.detail}</p>
                                    
                                    {errorMsg.domain && (
                                        <div className="flex items-center gap-2 bg-white border border-red-200 rounded-lg p-2">
                                            <code className="text-xs font-mono text-gray-700 flex-1 overflow-hidden text-ellipsis">
                                                {errorMsg.domain}
                                            </code>
                                            <button 
                                                onClick={copyDomain}
                                                className="text-brand-primary hover:text-brand-accent p-1"
                                                title="Copiar domínio"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {authMode === 'choice' && (
                                <>
                                    <div className="flex items-center gap-2 justify-center my-4">
                                        <div className="h-px bg-gray-200 w-12"></div>
                                        <span className="text-xs text-gray-400">{t('Use seu e-mail', 'Use your email')}</span>
                                        <div className="h-px bg-gray-200 w-12"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button 
                                            onClick={() => { setAuthMode('signup'); setErrorMsg(null); }} 
                                            variant="primary" 
                                            fullWidth
                                            className="bg-brand-text text-white hover:bg-black"
                                        >
                                            {t('Criar conta', 'Create account')}
                                        </Button>
                                        <Button 
                                            onClick={() => { setAuthMode('signin'); setErrorMsg(null); }} 
                                            variant="secondary"
                                            fullWidth
                                            className="bg-gray-50 text-brand-text border-gray-200"
                                        >
                                            {t('Entrar', 'Sign in')}
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2 justify-center my-4">
                                        <div className="h-px bg-gray-200 w-12"></div>
                                        <span className="text-xs text-gray-400">ou</span>
                                        <div className="h-px bg-gray-200 w-12"></div>
                                    </div>

                                    <Button 
                                        onClick={handleStartGuest} 
                                        variant="secondary"
                                        fullWidth
                                        className="bg-brand-primary/10 text-brand-primary border-none shadow-none hover:bg-brand-primary/20"
                                    >
                                        {t('Continuar como Visitante', 'Continue as Guest')}
                                    </Button>
                                </>
                            )}

                            {authMode === 'signup' && (
                                <div className="space-y-3 text-left animate-fade-slide-fast">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-brand-text">{t('Criar conta com e-mail', 'Create account with email')}</p>
                                        <button 
                                            onClick={() => { setAuthMode('choice'); setErrorMsg(null); }} 
                                            className="text-xs text-gray-500 hover:text-brand-primary"
                                        >
                                            {t('Voltar', 'Back')}
                                        </button>
                                    </div>
                                    <input 
                                        type="text"
                                        value={signupUsername}
                                        onChange={(e) => setSignupUsername(e.target.value)}
                                        placeholder={t('Nome de usuário', 'Username')}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/40 text-sm outline-none transition-all"
                                    />
                                    <input 
                                        type="email"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        placeholder={t('Seu e-mail', 'Your email')}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/40 text-sm outline-none transition-all"
                                    />
                                    <input 
                                        type="password"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        placeholder="Senha (mínimo 6 caracteres)"
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/40 text-sm outline-none transition-all"
                                    />
                                    <Button 
                                        onClick={handleCreateAccount} 
                                        fullWidth 
                                        disabled={authLoading || !signupEmail || !signupPassword || !signupUsername}
                                        className="bg-brand-text text-white hover:bg-black"
                                    >
                                        {authLoading ? t('Criando...', 'Creating...') : t('Criar conta e continuar', 'Create account and continue')}
                                    </Button>
                                    <p className="text-[11px] text-gray-500 text-center">
                                        {t('Usaremos este nome de usuário no painel e para registrar você no banco de dados.', 'We will use this username on the dashboard and to register you in the database.')}
                                    </p>
                                </div>
                            )}

                            {authMode === 'signin' && (
                                <div className="space-y-3 text-left animate-fade-slide-fast">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-brand-text">{t('Entrar com e-mail', 'Sign in with email')}</p>
                                        <button 
                                            onClick={() => { setAuthMode('choice'); setErrorMsg(null); }} 
                                            className="text-xs text-gray-500 hover:text-brand-primary"
                                        >
                                            {t('Voltar', 'Back')}
                                        </button>
                                    </div>
                                    <input 
                                        type="email"
                                        value={signinEmail}
                                        onChange={(e) => setSigninEmail(e.target.value)}
                                        placeholder="Seu e-mail"
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/40 text-sm outline-none transition-all"
                                    />
                                    <input 
                                        type="password"
                                        value={signinPassword}
                                        onChange={(e) => setSigninPassword(e.target.value)}
                                        placeholder={t('Senha', 'Password')}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/40 text-sm outline-none transition-all"
                                    />
                                    <Button 
                                        onClick={handleEmailLogin} 
                                        fullWidth 
                                        disabled={authLoading || !signinEmail || !signinPassword}
                                        className="bg-brand-text text-white hover:bg-black"
                                    >
                                        {authLoading ? t('Entrando...', 'Signing in...') : t('Entrar e continuar', 'Sign in and continue')}
                                    </Button>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-gray-500 gap-2">
                                        <span>{t('Esqueceu a senha? Crie uma conta nova com outro e-mail ou recupere no provedor.', 'Forgot password? Create a new account with another email or recover with your provider.')}</span>
                                        <button
                                            onClick={() => { setAuthMode('signup'); setErrorMsg(null); }}
                                            className="text-brand-primary hover:text-brand-accent font-semibold"
                                        >
                                            {t('Não tem conta? Criar', "Don't have an account? Sign up")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'modeConfirm' && (
                        <div className="animate-slide-up space-y-4">
                            <h1 className="font-serif heading-md mb-2 text-brand-text leading-tight">Como quer seguir?</h1>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Escolha se vai fazer a jornada solo, em casal presencial ou à distância. Assim entramos direto do jeito certo.
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-left">
                                <button
                                  onClick={() => handleModeAfterSignup('solo')}
                                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-all hover:border-brand-primary hover:bg-brand-primary/10"
                                >
                                  <p className="font-semibold text-brand-text">Solo</p>
                                  <p className="text-xs text-gray-500">Autocuidado e preparação.</p>
                                </button>
                                <button
                                  onClick={() => handleModeAfterSignup('couple')}
                                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-all hover:border-brand-primary hover:bg-brand-primary/10"
                                >
                                  <p className="font-semibold text-brand-text">Casal</p>
                                  <p className="text-xs text-gray-500">Rituais e conexão a dois.</p>
                                </button>
                                <button
                                  onClick={() => handleModeAfterSignup('distance')}
                                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-all hover:border-brand-primary hover:bg-brand-primary/10"
                                >
                                  <p className="font-semibold text-brand-text">Casal à distância</p>
                                  <p className="text-xs text-gray-500">Roteiros remotos guiados.</p>
                                </button>
                            </div>
                            <p className="text-[11px] text-gray-500">
                                Não se preocupe: você pode alterar depois nas informações do perfil.
                            </p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-slide-up">
                            <h1 className="font-serif heading-md mb-2 text-brand-text leading-tight">Como você se chama?</h1>
                            <p className="text-gray-500 mb-6">
                                {mode === 'solo' 
                                  ? 'Vamos personalizar sua jornada de autocuidado.' 
                                  : mode === 'couple' 
                                    ? 'Para personalizar a experiência do casal.' 
                                    : mode === 'distance'
                                      ? 'Vamos montar rituais para vocês na chamada e por áudio.'
                                      : 'Escolha um modo para continuarmos.'}
                            </p>
                            {!mode && (
                              <div className="grid grid-cols-3 gap-2 text-left mb-4">
                                  <button
                                    onClick={() => setMode('solo')}
                                    className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-all hover:border-brand-primary hover:bg-brand-primary/10"
                                  >
                                    <p className="font-semibold text-brand-text">Solo</p>
                                    <p className="text-xs text-gray-500">Autocuidado</p>
                                  </button>
                                  <button
                                    onClick={() => setMode('couple')}
                                    className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-all hover:border-brand-primary hover:bg-brand-primary/10"
                                  >
                                    <p className="font-semibold text-brand-text">Casal</p>
                                    <p className="text-xs text-gray-500">A dois</p>
                                  </button>
                                  <button
                                    onClick={() => setMode('distance')}
                                    className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-all hover:border-brand-primary hover:bg-brand-primary/10"
                                  >
                                    <p className="font-semibold text-brand-text">À distância</p>
                                    <p className="text-xs text-gray-500">Chamadas e áudios</p>
                                  </button>
                              </div>
                            )}
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/50 text-center text-lg mb-6 outline-none transition-all"
                                autoFocus
                            />
                            <Button onClick={handleNext} fullWidth disabled={!name || !mode}>
                                Continuar <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (mode === 'couple' || mode === 'distance') && (
                        <div className="animate-slide-up">
                             <h1 className="font-serif heading-md mb-2 text-brand-text leading-tight">E seu parceiro(a)?</h1>
                             <p className="text-gray-500 mb-6">
                              {mode === 'distance' ? 'Como se chama quem vai fazer a jornada com você à distância?' : 'Como se chama seu amor?'}
                             </p>
                             <input 
                                type="text"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                placeholder="Nome dele(a)"
                                className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/50 text-center text-lg mb-6 outline-none transition-all"
                                autoFocus
                            />
                             <Button onClick={handleNext} fullWidth disabled={!partnerName}>
                                Começar Jornada <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </div>
                
                <p className="text-center text-gray-400 text-xs mt-8">
                    {t('Conexão em 3 Minutos • Jornada guiada de 7 dias gratuita', '3-Minute Connection • Guided 7-day journey free')}
                </p>
            </div>
        </div>
    );
};
