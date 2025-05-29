import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Globe,
    Lock,
    Mail,
    User,
    MapPin,
    Users,
    Briefcase
} from 'lucide-react';

function Index() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/auth/verify-token', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.valid) {
                        navigate('/home');
                    } else {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('userData');
                    }
                } else {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                }
            } catch (error) {
                console.error('Erro ao verificar token:', error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            setIsLoading(false);
            return;
        }

        if (!isLogin && !name) {
            setError('Por favor, insira seu nome');
            setIsLoading(false);
            return;
        }

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const body = isLogin ? 
                { email, password } : 
                { name, email, password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro na autenticação');
            }

            if (isLogin) {
                localStorage.setItem('authToken', data.token);
                navigate('/home');
            } else {
                setIsLogin(true);
                setError('Conta criada com sucesso! Faça login para continuar.');
                setEmail('');
                setPassword('');
                setName('');
            }
        } catch (err) {
            setError(err.message || 'Erro na conexão com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url(images/pexels-willianjusten-28948282.jpg)] bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                    {/* Seção Ilustrativa */}
                    <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-teal-500 p-12 text-white flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M11%2018c3.866%200%207-3.134%207-7s-3.134-7-7-7-7%203.134-7%207%203.134%207%207%207zm48%2025c3.866%200%207-3.134%207-7s-3.134-7-7-7-7%203.134-7%207%203.134%207%207%207zm-43-7c1.657%200%203-1.343%203-3s-1.343-3-3-3-3%201.343-3%203%201.343%203%203%203zm63%2031c1.657%200%203-1.343%203-3s-1.343-3-3-3-3%201.343-3%203%201.343%203%203%203zM34%2090c1.657%200%203-1.343%203-3s-1.343-3-3-3-3%201.343-3%203%201.343%203%203%203zm56-76c1.657%200%203-1.343%203-3s-1.343-3-3-3-3%201.343-3%203%201.343%203%203%203zM12%2086c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm28-65c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm23-11c2.76%200%205-2.24%205-5s-2.24-5-5-5-5%202.24-5%205%202.24%205%205%205zm-6%2060c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm29%2022c2.76%200%205-2.24%205-5s-2.24-5-5-5-5%202.24-5%205%202.24%205%205%205zM32%2063c2.76%200%205-2.24%205-5s-2.24-5-5-5-5%202.24-5%205%202.24%205%205%205zm57-13c2.76%200%205-2.24%205-5s-2.24-5-5-5-5%202.24-5%205%202.24%205%205%205z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%220.1%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] opacity-30"></div>
                        <Briefcase className="w-24 h-24 mb-8 animate-float text-white/90" />
                        <h2 className="text-5xl font-bold mb-6 text-center relative">TravelConnect</h2>
                        <p className="text-lg text-center opacity-90 mb-12 relative">
                            Conecte-se com viajantes pelo mundo e compartilhe suas aventuras!
                        </p>
                        <div className="flex space-x-6 relative">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Globe className="w-7 h-7" />
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Users className="w-7 h-7" />
                            </div>
                        </div>
                    </div>

                    {/* Seção do Formulário */}
                    <div className="md:w-1/2 p-12">
                        <div className="mb-10">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                            </h1>
                            <p className="text-gray-500 mt-2">
                                {isLogin ? 'Continue sua jornada' : 'Comece sua aventura'}
                            </p>
                        </div>

                        {error && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center ${
                                error.includes('sucesso') 
                                    ? 'bg-green-50/50 text-green-700 border border-green-200' 
                                    : 'bg-red-50/50 text-red-700 border border-red-200'
                            }`}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Nome completo</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                            placeholder="Digite seu nome"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">E-mail</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        placeholder="Digite seu e-mail"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Senha</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        placeholder="Digite sua senha"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium
                                    hover:from-blue-700 hover:to-teal-600 focus:ring-2 focus:ring-blue-200 
                                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                                    flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <span>{isLogin ? 'Entrar na Comunidade' : 'Começar minha Jornada'}</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                {isLogin ? 'Primeira vez aqui? ' : 'Já faz parte? '}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setEmail('');
                                        setPassword('');
                                        setName('');
                                    }}
                                    className="text-blue-600 font-semibold hover:text-blue-700 focus:outline-none focus:underline transition-colors"
                                >
                                    {isLogin ? 'Explorar registro' : 'Acessar minha conta'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;