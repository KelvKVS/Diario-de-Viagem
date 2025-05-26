import { CalendarDays, MapPin, Users } from "lucide-react";

function TripCard() {
    return (
        <div className="max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl hover:scale-[1.01] duration-300 m-4">
            <div className="flex flex-col md:flex-row">
                <img
                    className="w-full md:w-1/3 max-h-48 md:max-h-full object-cover"
                    src="https://placehold.co/400x400"
                    alt="Trip Thumbnail"
                />
                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Viagem para São Paulo</h3>

                        <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm mb-4">
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                São Paulo, Brasil
                            </div>
                            <div className="flex items-center">
                                <CalendarDays className="w-4 h-4 mr-2" />
                                15 de outubro de 2023
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                8 participantes
                            </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed mt-4">
                            Viagem de negócios para a sede da empresa. Aproveitamos para conhecer os novos
                            escritórios e alinhar estratégias com o time local.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TripCard;
