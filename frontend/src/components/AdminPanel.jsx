import React from 'react';
import AdminTabs from './AdminTabs';
import FormField from './FormField';
import { Calendar } from 'lucide-react';

const AdminPanel = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  trip,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  error,
  onTripChange
}) => {
  if (!isOpen) return null;

  const tabs = [
    { id: 'edit', label: 'Editar' },
    { id: 'settings', label: 'Configurações' }
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Painel Administrativo</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <AdminTabs
            activeTab={activeTab}
            onTabChange={onTabChange}
            tabs={tabs}
          />

          <div className="mt-6">
            {activeTab === 'edit' && (
              <div className="space-y-6">
                <FormField
                  label="Título da Viagem"
                  value={trip.name}
                  onChange={(e) => onTripChange('name', e.target.value)}
                  placeholder="Digite o título da viagem"
                />

                <FormField
                  label="Descrição"
                  type="textarea"
                  value={trip.description}
                  onChange={(e) => onTripChange('description', e.target.value)}
                  placeholder="Digite a descrição da viagem"
                  rows={4}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Data de Início"
                    type="date"
                    value={trip.startDate}
                    onChange={(e) => onTripChange('startDate', e.target.value)}
                  />

                  <FormField
                    label="Data de Término"
                    type="date"
                    value={trip.endDate}
                    onChange={(e) => onTripChange('endDate', e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Término
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => onTripChange('endDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-red-800 mb-2">Zona de Perigo</h3>
                  <p className="text-sm text-red-600 mb-4">
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a viagem
                    e todos os dados associados.
                  </p>
                  <button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? 'Excluindo...' : 'Excluir Viagem'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 