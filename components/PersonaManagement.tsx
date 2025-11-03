import React from 'react';
import { UserPersona } from '../types';
import { BackArrowIcon, PencilIcon, PlusIcon } from './icons';

interface PersonaManagementProps {
  personas: UserPersona[];
  onBack: () => void;
  onAddPersona: () => void;
  onEditPersona: (persona: UserPersona) => void;
}

const PersonaManagement: React.FC<PersonaManagementProps> = ({
  personas,
  onBack,
  onAddPersona,
  onEditPersona,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0D0D0D] text-white">
      <header className="flex items-center justify-between p-4 sticky top-0 bg-[#0D0D0D] z-10 border-b border-gray-800">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
          <BackArrowIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Hồn Nguyên Ký</h1>
         <div className="w-10"></div> {/* Spacer */}
      </header>

      <main className="flex-grow p-4 overflow-y-auto space-y-4">
        {personas.map(persona => (
          <div key={persona.id} className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
            <div className="flex items-start space-x-4">
              <img src={persona.imageUrl} alt={persona.name} className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500" />
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-cyan-400">{persona.name}</h2>
                    <p className="text-sm text-gray-400">{persona.tagline}</p>
                  </div>
                  <button onClick={() => onEditPersona(persona)} className="p-2 rounded-full hover:bg-gray-700">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
                    <StatCard label="CÔNG ĐỨC" value={persona.stats.congDuc} />
                    <StatCard label="NGHIỆP LỰC" value={persona.stats.nghiepLuc} />
                    <StatCard label="TÍN NGƯỠNG" value={persona.stats.tinNguong} />
                    <StatCard label="KHÍ VẬN" value={persona.stats.khiVan} />
                </div>
              </div>
            </div>
             <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="font-semibold mb-2 text-gray-300">Tiểu sử</h3>
                <p className="text-sm text-gray-400 whitespace-pre-wrap">{persona.biography}</p>
            </div>
          </div>
        ))}
         <button 
            onClick={onAddPersona}
            className="w-full flex items-center justify-center p-4 rounded-lg bg-[#1A1A1A] border-2 border-dashed border-gray-600 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
        >
            <PlusIcon className="w-6 h-6 mr-2" />
            <span className="font-semibold">Thêm chân dung</span>
        </button>
      </main>
    </div>
  );
};

const StatCard: React.FC<{label: string, value: number | string}> = ({label, value}) => (
    <div className="bg-[#0D0D0D] p-3 rounded-md">
        <p className="text-xs text-gray-500 font-semibold tracking-wider">{label}</p>
        <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
);


export default PersonaManagement;