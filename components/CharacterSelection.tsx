import React from 'react';
import { Character } from '../types';
import CharacterCard from './CharacterCard';
import { BackArrowIcon, PlusIcon } from './icons';

interface CharacterSelectionProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
  onEditCharacter: (character: Character) => void;
  onCreateCharacter: () => void;
  onBack: () => void;
}

const CharacterSelectionHeader: React.FC<{onBack: () => void, onCreate: () => void}> = ({ onBack, onCreate }) => {
    return (
        <header className="p-4 flex items-center justify-between sticky top-0 bg-black z-10">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
                <BackArrowIcon className="w-6 h-6"/>
            </button>
            <h1 className="text-xl font-bold">Bắt đầu cuộc trò chuyện mới</h1>
             <button onClick={onCreate} className="p-2 rounded-full hover:bg-gray-800">
                <PlusIcon className="w-6 h-6"/>
            </button>
        </header>
    );
};


const CharacterSelection: React.FC<CharacterSelectionProps> = ({ 
  characters, 
  onSelectCharacter,
  onEditCharacter,
  onCreateCharacter,
  onBack
}) => {
  return (
    <div className="flex flex-col h-full bg-black">
      <CharacterSelectionHeader onBack={onBack} onCreate={onCreateCharacter} />
      <main className="flex-grow p-4 overflow-y-auto">
        <p className="text-gray-400 mb-4">Chọn một nhân vật để bắt đầu trò chuyện.</p>
        <div className="grid grid-cols-2 gap-4">
          {characters.map(character => (
            <CharacterCard 
              key={character.id} 
              character={character} 
              onSelect={() => onSelectCharacter(character)}
              onEdit={() => onEditCharacter(character)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CharacterSelection;