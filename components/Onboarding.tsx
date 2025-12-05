import React, { useState } from 'react';
import { Button } from './Button';
import { Heart, ArrowRight, AlertTriangle, Copy, Check } from 'lucide-react';
import { createAccountWithEmail, loginWithEmail, loginWithGoogle } from '../services/firebase';
import { translateAuthError } from '../services/firebaseErrors';

interface OnboardingProps {
    onComplete: (name: string, partnerName: string, mode: 'solo' | 'couple' | 'distance') => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState<number | 'modeConfirm'>(0); // 0 = Welcome/Login, 1 = My Name, 2 = Partner Name, modeConfirm = pós signup
    const [name, setName] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [mode, setMode] = useState<'solo' | 'couple' | 'distance' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'choice' | 'signup' | 'signin'>('choice');
    const [authLoading, setAuthLoading] = useState(false);
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signinEmail, setSigninEmail] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<{title: string, detail: string, domain?: string} | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            await loginWithGoogle();
            // App.tsx auth listener will handle the transition
        } catch (error: any) {
            console.error("Login error:", error);
            setIsLoading(false);
            
            if (error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized-domain')) {
                const currentDomain = window.location.hostname;
                setErrorMsg({
                    title: "Domínio precisa de autorização",
                    detail: "O Firebase bloqueou o login por segurança. Adicione o domínio abaixo no console do Firebase em Authentication > Settings > Authorized Domains.",
                    domain: currentDomain
                });
            } else if (error.code === 'auth/popup-closed-by-user') {
                return;
            } else {
                const translated = translateAuthError(error, 'conectar com Google');
                setErrorMsg(translated);
            }
        }
    };

    const copyDomain = () => {
        if (errorMsg?.domain) {
            navigator.clipboard.writeText(errorMsg.domain);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-4 rounded-full shadow-lg shadow-brand-primary/20">
                         <Heart className="w-10 h-10 text-brand-primary fill-brand-primary animate-pulse-slow" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 text-center card-padding rounded-surface card-float soft-hover transition-all duration-300">
                    
                    {step === 0 && (
                        <div className="animate-slide-up space-y-4">
                            <h1 className="font-serif heading-md mb-2 text-brand-text leading-tight">Bem-vindo(a)</h1>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                {authMode === 'signin'
                                  ? "Entre na sua conta para continuar de onde parou."
                                  : "Escolha como quer viver a jornada: sozinho(a), em casal presencial ou à distância. Você pode ajustar depois no perfil."}
                            </p>

                            {authMode !== 'signin' && (
                              <div className="grid grid-cols-3 gap-2 text-left mb-6">
                                  <button
                                    onClick={() => setMode('solo')}
                                    className={`p-3 rounded-xl border ${mode === 'solo' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'} text-sm transition-all`}
                                  >
                                    <p className="font-semibold text-brand-text">Solo</p>
                                    <p className="text-xs text-gray-500">Autocuidado, comunicação futura, presença consigo.</p>
                                  </button>
                                  <button
                                    onClick={() => setMode('couple')}
                                    className={`p-3 rounded-xl border ${mode === 'couple' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'} text-sm transition-all`}
                                  >
                                    <p className="font-semibold text-brand-text">Casal</p>
                                    <p className="text-xs text-gray-500">Rituais a dois, redução de ruídos, alinhamento diário.</p>
                                  </button>
                                  <button
                                    onClick={() => setMode('distance')}
                                    className={`p-3 rounded-xl border ${mode === 'distance' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'} text-sm transition-all`}
                                  >
                                    <p className="font-semibold text-brand-text">Casal à distância</p>
                                    <p className="text-xs text-gray-500">Chamadas, áudios e rituais remotos.</p>
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
                                    <Button 
                                        variant="outline" 
                                        fullWidth 
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <span className="animate-pulse">Conectando...</span>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                                </svg>
                                                Entrar com Google
                                            </>
                                        )}
                                    </Button>

                                    <div className="flex items-center gap-2 justify-center my-4">
                                        <div className="h-px bg-gray-200 w-12"></div>
                                        <span className="text-xs text-gray-400">ou use seu e-mail</span>
                                        <div className="h-px bg-gray-200 w-12"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button 
                                            onClick={() => { setAuthMode('signup'); setErrorMsg(null); }} 
                                            variant="primary" 
                                            fullWidth
                                            className="bg-brand-text text-white hover:bg-black"
                                        >
                                            Criar conta
                                        </Button>
                                        <Button 
                                            onClick={() => { setAuthMode('signin'); setErrorMsg(null); }} 
                                            variant="secondary"
                                            fullWidth
                                            className="bg-gray-50 text-brand-text border-gray-200"
                                        >
                                            Entrar
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
                                        Continuar como Visitante
                                    </Button>
                                </>
                            )}

                            {authMode === 'signup' && (
                                <div className="space-y-3 text-left animate-fade-slide-fast">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-brand-text">Criar conta com e-mail</p>
                                        <button 
                                            onClick={() => { setAuthMode('choice'); setErrorMsg(null); }} 
                                            className="text-xs text-gray-500 hover:text-brand-primary"
                                        >
                                            Voltar
                                        </button>
                                    </div>
                                    <input 
                                        type="text"
                                        value={signupUsername}
                                        onChange={(e) => setSignupUsername(e.target.value)}
                                        placeholder="Nome de usuário"
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/40 text-sm outline-none transition-all"
                                    />
                                    <input 
                                        type="email"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        placeholder="Seu e-mail"
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
                                        {authLoading ? 'Criando...' : 'Criar conta e continuar'}
                                    </Button>
                                    <p className="text-[11px] text-gray-500 text-center">
                                        Usaremos este nome de usuário no painel e para registrar você no banco de dados.
                                    </p>
                                </div>
                            )}

                            {authMode === 'signin' && (
                                <div className="space-y-3 text-left animate-fade-slide-fast">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-brand-text">Entrar com e-mail</p>
                                        <button 
                                            onClick={() => { setAuthMode('choice'); setErrorMsg(null); }} 
                                            className="text-xs text-gray-500 hover:text-brand-primary"
                                        >
                                            Voltar
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
                                        placeholder="Senha"
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/40 text-sm outline-none transition-all"
                                    />
                                    <Button 
                                        onClick={handleEmailLogin} 
                                        fullWidth 
                                        disabled={authLoading || !signinEmail || !signinPassword}
                                        className="bg-brand-text text-white hover:bg-black"
                                    >
                                        {authLoading ? 'Entrando...' : 'Entrar e continuar'}
                                    </Button>
                                    <p className="text-[11px] text-gray-500 text-center">
                                        Se esqueceu a senha, use Entrar com Google ou crie uma conta nova.
                                    </p>
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
                    Conexão em 3 Minutos • Jornada guiada de 7 dias gratuita
                </p>
            </div>
        </div>
    );
};
