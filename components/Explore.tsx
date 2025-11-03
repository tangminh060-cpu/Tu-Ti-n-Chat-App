import React from 'react';
import { Character } from '../types';
import CharacterCard from './CharacterCard';
import { BackArrowIcon } from './icons';

interface ExploreProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
  onEditCharacter: (character: Character) => void;
  onBack: () => void;
}

const ExploreHeader: React.FC<{onBack: () => void}> = ({ onBack }) => {
    return (
        <header className="p-4 flex items-center justify-between sticky top-0 bg-black z-10 border-b border-gray-800">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
                <BackArrowIcon className="w-6 h-6"/>
            </button>
            <h1 className="text-xl font-bold">Khám phá Nhân vật</h1>
            <div className="w-10"></div> {/* Spacer */}
        </header>
    );
};

const Explore: React.FC<ExploreProps> = ({ 
  characters, 
  onSelectCharacter,
  onEditCharacter,
  onBack
}) => {
  return (
    <div className="flex flex-col h-full bg-black">
      <ExploreHeader onBack={onBack} />
      <main className="flex-grow p-4 overflow-y-auto">
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

export default Explore;