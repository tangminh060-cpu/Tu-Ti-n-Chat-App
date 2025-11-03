import React, { useState } from 'react';
import { UserPersona } from '../types';
import { CheckIcon } from './icons';

interface PersonaSwitcherProps {
    isOpen: boolean;
    onClose: () => void;
    personas: UserPersona[];
    activePersona: UserPersona;
    onSelectPersona: (persona: UserPersona) => void;
    onManage: () => void;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ 
    isOpen, 
    onClose, 
    personas, 
    activePersona, 
    onSelectPersona,
    onManage
}) => {
    if (!isOpen) return null;

    const [selectedId, setSelectedId] = useState(activePersona.id);

    const handleConfirm = () => {
        const newActivePersona = personas.find(p => p.id === selectedId);
        if (newActivePersona) {
            onSelectPersona(newActivePersona);
        }
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex justify-center items-end p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#1F1F1F] w-full max-w-lg rounded-2xl p-6 flex flex-col max-h-[70vh] border border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">Switch Persona</h2>
                </div>
                
                <ul className="space-y-3 overflow-y-auto flex-grow mb-4 pr-2">
                    {personas.map(persona => (
                        <li 
                            key={persona.id}
                            onClick={() => setSelectedId(persona.id)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${selectedId === persona.id ? 'bg-[#3E382A] border-yellow-500' : 'bg-[#2D2D2D] border-transparent hover:bg-gray-700'}`}
                        >
                            <img src={persona.imageUrl} alt={persona.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                            <div className="ml-4 flex-grow overflow-hidden">
                                <h3 className="font-semibold text-white truncate">{persona.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-1">{persona.biography}</p>
                            </div>
                            {selectedId === persona.id && <CheckIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 ml-2" />}
                        </li>
                    ))}
                </ul>
                
                <button 
                    onClick={onManage}
                    className="w-full text-center p-3 mb-4 rounded-lg font-semibold bg-[#2D2D2D] hover:bg-gray-700 transition-colors"
                >
                    Manage Personas
                </button>


                <div className="flex gap-4">
                    <button onClick={onClose} className="w-full py-3 bg-gray-700 rounded-full font-bold hover:bg-gray-600 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} className="w-full py-3 bg-yellow-500 text-black rounded-full font-bold hover:bg-yellow-400 transition-colors">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PersonaSwitcher;