import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  Heart,
  MessageSquare,
  Share,
  MoreVertical,
  Bookmark,
  Map,
  Camera,
  Globe,
  Smile,
  Navigation,
  Star,
  Compass,
  Send,
  ChevronDown,
  Globe as GlobeIcon,
} from "lucide-react";

function Home() {
  const [liked, setLiked] = useState(false);
  const [liked2, setLiked2] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saved2, setSaved2] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showComments2, setShowComments2] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Seção de Boas-Vindas Aprimorada */}
      <div className="min-h-[70vh] bg-gradient-to-br from-sky-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-amber-400/20 blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-emerald-400/20 blur-2xl"></div>

        {/* Forma decorativa */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-10 blur-3xl"></div>

        {/* Conteúdo principal */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-1.5 rounded-full mb-6">
            <GlobeIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Explore o mundo conosco</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Conectando viajantes,
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              inspirando jornadas
            </span>
          </h1>

          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              No TravelConnect, cada viagem é uma história compartilhada.
            </span>
            Descubra destinos autênticos através dos olhos de outros
            exploradores e inspire-se para criar suas próprias aventuras
            inesquecíveis.
          </p>

          {/* Elementos interativos */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <button className="flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
              <Compass className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
              <span>Começe a explorar</span>
            </button>

            <button className="flex items-center justify-center px-8 py-3.5 bg-white text-gray-800 font-medium rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <Send className="w-5 h-5 mr-2" />
              <span>Compartilhe sua viagem</span>
            </button>
          </div>

          {/* Estatísticas da comunidade */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto shadow-sm border border-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">250K+</div>
                <div className="text-gray-600 text-sm">Viajantes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">120+</div>
                <div className="text-gray-600 text-sm">Países explorados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">1.2M+</div>
                <div className="text-gray-600 text-sm">Experiências</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">98%</div>
                <div className="text-gray-600 text-sm">Recomendam</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards flutuantes com depoimentos */}
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 px-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                M
              </div>
              <div>
                <div className="font-semibold">Mariana S.</div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Encontrei rotas incríveis no Peru que nem os guias de viagem
              conhecem. Essa comunidade mudou completamente minha forma de
              viajar!"
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                R
              </div>
              <div>
                <div className="font-semibold">Ricardo T.</div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Compartilhei minha viagem pelo Nordeste e recebi dicas
              valiosíssimas de moradores locais. A conexão humana aqui é o
              melhor!"
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                C
              </div>
              <div>
                <div className="font-semibold">Camila F.</div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Graças ao TravelConnect conheci um grupo para viajar ao Japão.
              Fiz amigos para vida toda e experiências únicas!"
            </p>
          </div>
        </div>

        {/* Elemento decorativo final */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Seção de Posts */}
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Últimas Experiências
          </h2>
          <p className="text-gray-600">
            Inspire-se com as viagens recentes da nossa comunidade
          </p>
        </div>

        {/* Card 1 - Viagem de Negócios */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl mb-10">
          {/* Cabeçalho do Post - Perfil do Usuário */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Perfil"
              />
              <div className="ml-3">
                <h4 className="font-semibold text-gray-900">Carolina Mendes</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarDays className="w-3 h-3 mr-1" />
                  <span>Postado em 12 de outubro de 2023</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo do Post */}
          <div className="relative">
            <img
              className="w-full h-80 object-cover"
              src="https://images.unsplash.com/photo-1543059080-f9b1272213d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
              alt="São Paulo Skyline"
            />

            {/* Tags de localização */}
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="flex items-center text-gray-800 font-medium">
                <MapPin className="w-4 h-4 mr-1 text-teal-600" />
                <span>São Paulo, Brasil</span>
              </div>
            </div>
          </div>

          {/* Interações */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center ${
                    liked
                      ? "text-rose-500"
                      : "text-gray-500 hover:text-rose-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                  <span className="ml-1">245</span>
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center text-gray-500 hover:text-indigo-600"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="ml-1">42</span>
                </button>

                <button className="flex items-center text-gray-500 hover:text-emerald-600">
                  <Share className="w-5 h-5" />
                  <span className="ml-1">Compartilhar</span>
                </button>
              </div>

              <button
                onClick={() => setSaved(!saved)}
                className={`${
                  saved
                    ? "text-amber-500"
                    : "text-gray-500 hover:text-amber-500"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${saved ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Viagem Corporativa em SP ✨
            </h3>

            <p className="text-gray-700 mb-4">
              Essa semana tive a oportunidade de visitar nossos escritórios em
              São Paulo! Além das reuniões importantes, consegui explorar um
              pouco da cidade que nunca dorme. Destaque para o rooftop do hotel
              com essa vista incrível do skyline paulistano ao pôr do sol! 🌇
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                #viagemdenegócios
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                #sampa
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                #skyline
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <img
                className="aspect-square object-cover rounded-lg"
                src="https://images.unsplash.com/photo-1563456675591-2e8f3c6d8e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Reunião"
              />
              <img
                className="aspect-square object-cover rounded-lg"
                src="https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Comida"
              />
              <img
                className="aspect-square object-cover rounded-lg"
                src="https://images.unsplash.com/photo-1543716627-839b54c40519?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Equipe"
              />
            </div>
          </div>

          {/* Comentários */}
          {showComments && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="Perfil"
                />
                <div className="flex-1 ml-3">
                  <input
                    type="text"
                    placeholder="Adicione um comentário..."
                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <img
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Perfil"
                  />
                  <div className="ml-3 bg-gray-100 rounded-xl px-4 py-2">
                    <div className="font-semibold text-gray-900">
                      Juliana Costa
                    </div>
                    <p className="text-gray-700">
                      Que vista incrível! Qual hotel foi esse? Estou planejando
                      uma viagem para SP mês que vem 😍
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>2 horas atrás</span>
                      <button className="ml-3 font-medium text-gray-600 hover:text-teal-600">
                        Responder
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <img
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Perfil"
                  />
                  <div className="ml-3 bg-gray-100 rounded-xl px-4 py-2">
                    <div className="font-semibold text-gray-900">
                      Marcos Oliveira
                    </div>
                    <p className="text-gray-700">
                      SP nunca decepciona nas vistas! Recomendo visitar o
                      Instituto Moreira Salles se tiver tempo, tem uma exposição
                      ótima agora.
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>1 hora atrás</span>
                      <button className="ml-3 font-medium text-gray-600 hover:text-teal-600">
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 2 - Viagem de Lazer */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Cabeçalho do Post - Perfil do Usuário */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Perfil"
              />
              <div className="ml-3">
                <h4 className="font-semibold text-gray-900">Rafael Torres</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarDays className="w-3 h-3 mr-1" />
                  <span>Postado em 8 de outubro de 2023</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo do Post */}
          <div className="relative">
            <img
              className="w-full h-80 object-cover"
              src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Fernando de Noronha"
            />

            {/* Tags de localização */}
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="flex items-center text-gray-800 font-medium">
                <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                <span>Fernando de Noronha, Brasil</span>
              </div>
            </div>

            {/* Mapa interativo simplificado */}
            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <Globe className="w-4 h-4 text-emerald-600 mr-2" />
                <span className="font-medium text-sm">Roteiro</span>
              </div>
              <div className="flex items-center text-xs text-gray-700 mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <span>Praia do Sancho</span>
              </div>
              <div className="flex items-center text-xs text-gray-700 mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <span>Baía dos Golfinhos</span>
              </div>
              <div className="flex items-center text-xs text-gray-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <span>Mirante dos Golfinhos</span>
              </div>
            </div>
          </div>

          {/* Interações */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setLiked2(!liked2)}
                  className={`flex items-center ${
                    liked2
                      ? "text-rose-500"
                      : "text-gray-500 hover:text-rose-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${liked2 ? "fill-current" : ""}`}
                  />
                  <span className="ml-1">512</span>
                </button>

                <button
                  onClick={() => setShowComments2(!showComments2)}
                  className="flex items-center text-gray-500 hover:text-indigo-600"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="ml-1">67</span>
                </button>

                <button className="flex items-center text-gray-500 hover:text-emerald-600">
                  <Share className="w-5 h-5" />
                  <span className="ml-1">Compartilhar</span>
                </button>
              </div>

              <button
                onClick={() => setSaved2(!saved2)}
                className={`${
                  saved2
                    ? "text-amber-500"
                    : "text-gray-500 hover:text-amber-500"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${saved2 ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Paraíso em Noronha 🌴
            </h3>

            <p className="text-gray-700 mb-4">
              Finalmente realizei o sonho de conhecer Fernando de Noronha! A
              água é mais azul do que qualquer foto pode mostrar, e os
              golfinhos? São centenas que aparecem todos os dias na Baía dos
              Golfinhos! A natureza aqui é preservada de uma forma que todos os
              brasileiros deveriam experimentar. Dica: acordar às 5h para ver o
              nascer do sol na Praia do Sancho vale cada minuto de sono perdido!
              🌅
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full">
                #noronha
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full">
                #paraiso
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full">
                #viagemdossonhos
              </span>
            </div>

            {/* Dicas de viagem */}
            <div className="bg-amber-50 rounded-xl p-4 mt-5">
              <div className="flex items-center text-amber-800 mb-2">
                <Navigation className="w-5 h-5 mr-2" />
                <h4 className="font-semibold">Minhas Dicas</h4>
              </div>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>
                  • Alugue uma buggy para explorar a ilha - vale cada centavo!
                </li>
                <li>
                  • Chegue cedo nas praias para garantir bom lugar (antes das
                  9h)
                </li>
                <li>
                  • Não perca o pôr do sol no Forte de Nossa Senhora dos
                  Remédios
                </li>
                <li>• Prove o bolinho de peixe na barraca da Tia Zete</li>
              </ul>
            </div>
          </div>

          {/* Rodapé com informações de viagem */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-700">15 a 22 de Setembro, 2023</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-700">Viagem com amigos</span>
              </div>
              <div className="flex items-center">
                <Camera className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-700">Fotos com Sony A7III</span>
              </div>
              <div className="flex items-center">
                <Smile className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-700">Experiência: 10/10</span>
              </div>
            </div>
          </div>

          {/* Comentários */}
          {showComments2 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="Perfil"
                />
                <div className="flex-1 ml-3">
                  <input
                    type="text"
                    placeholder="Adicione um comentário..."
                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <img
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Perfil"
                  />
                  <div className="ml-3 bg-gray-100 rounded-xl px-4 py-2">
                    <div className="font-semibold text-gray-900">
                      Juliana Costa
                    </div>
                    <p className="text-gray-700">
                      Que vista incrível! Qual hotel foi esse? Estou planejando
                      uma viagem para SP mês que vem 😍
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>2 horas atrás</span>
                      <button className="ml-3 font-medium text-gray-600 hover:text-emerald-600">
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );   
}

export default Home;