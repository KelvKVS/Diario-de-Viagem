import TripCard from "../components/Tripcard";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mt-8">Bem-vindo ao TravelConnect</h1>
      <p className="text-gray-600 mt-2 mb-6">
        Descubra e compartilhe experiências de viagem incríveis com nossa comunidade.
      </p>
      <TripCard />
    </div>
  );   
}

export default Home;