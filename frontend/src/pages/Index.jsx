import React, { useState } from 'react';
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
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validação básica
        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (!isLogin && !name) {
            setError('Por favor, insira seu nome');
            return;
        }

        try {
            // Simular chamada API
            const response = await fakeAuthService({ email, password, name });

            if (response.success) {
                localStorage.setItem('authToken', response.token);
                navigate('/home');
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Erro na conexão com o servidor');
        }
    };

    return (
        <div className="min-h-screen bg-[url(images/pexels-willianjusten-28948282.jpg)] bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row sm:m-3">
                    {/* Seção Ilustrativa */}
                    <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-teal-400 p-8 text-white flex flex-col justify-center items-center">
                        <Briefcase className="w-20 h-20 mb-6 animate-float" />
                        <h2 className="text-4xl font-bold mb-4 text-center">TravelConnect</h2>
                        <p className="text-lg text-center opacity-90">
                            Conecte-se com viajantes pelo mundo e compartilhe suas aventuras!
                        </p>
                        <div className="mt-8 flex space-x-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Seção do Formulário */}
                    <div className="md:w-1/2 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                            </h1>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder=" "
                                        className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none peer"
                                    />
                                    <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-teal-500 peer-placeholder-shown:top-3">
                                        <User className="inline w-5 h-5 mr-2" />
                                        Nome completo
                                    </label>
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder=" "
                                    className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none peer"
                                />
                                <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-teal-500 peer-placeholder-shown:top-3">
                                    <Mail className="inline w-5 h-5 mr-2" />
                                    Endereço de email
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder=" "
                                    className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none peer"
                                />
                                <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-teal-500 peer-placeholder-shown:top-3">
                                    <Lock className="inline w-5 h-5 mr-2" />
                                    Senha
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center"
                            >
                                {isLogin ? 'Entrar na Comunidade' : 'Começar minha Jornada'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500">
                                {isLogin ? 'Primeira vez aqui? ' : 'Já faz parte? '}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-teal-600 font-semibold hover:text-teal-700"
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


// Função simulada de autenticação (substituir por API real)
const fakeAuthService = async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay

    if (credentials.email === 'test@example.com' && credentials.password === 'senha123') {
        return { success: true, token: 'fake-jwt-token' };
    }
    return { success: false, message: 'Credenciais inválidas' };
};

export default Index;