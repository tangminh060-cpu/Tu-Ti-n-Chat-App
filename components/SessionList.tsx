import React from 'react';
import { Character, ChatSession } from '../types';
import { BackArrowIcon, PlusIcon, TrashIcon } from './icons';

interface SessionListProps {
  character: Character;
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onCreateNew: () => void;
  onDeleteSession: (sessionId: string) => void;
  onBack: () => void;
}

const SessionListItem: React.FC<{
    session: ChatSession;
    onSelect: () => void;
    onDelete: () => void;
}> = ({ session, onSelect, onDelete }) => {
    
    const lastMessage = session.messages[session.messages.length - 1];
    const messagePreview = lastMessage ? `${lastMessage.sender === 'user' ? 'Bạn: ' : ''}${lastMessage.text}` : 'Bắt đầu cuộc trò chuyện...';

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <li 
            onClick={onSelect}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors group"
        >
            <div className="flex-1 overflow-hidden">
                 <h2 className="font-semibold truncate">{session.title}</h2>
                 <p className="text-sm text-gray-400 truncate">{messagePreview}</p>
                 <p className="text-xs text-gray-500 mt-1">{new Date(session.createdAt).toLocaleString()}</p>
            </div>
            <button 
                onClick={handleDeleteClick}
                className="p-2 rounded-full text-gray-500 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete Session"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </li>
    );
}

const SessionList: React.FC<SessionListProps> = ({ 
    character, 
    sessions, 
    onSelectSession, 
    onCreateNew,
    onDeleteSession,
    onBack 
}) => {
  return (
    <div className="flex flex-col h-full bg-black">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-black z-10 border-b border-gray-800">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800">
                <BackArrowIcon className="w-6 h-6"/>
            </button>
            <div className="flex items-center gap-3 min-w-0">
                <img src={character.imageUrl} alt={character.name} className="w-10 h-10 rounded-full object-cover" />
                <h1 className="text-xl font-bold truncate">{character.name}</h1>
            </div>
            <button onClick={onCreateNew} className="p-2 rounded-full hover:bg-gray-800" title="Bắt đầu cuộc trò chuyện mới">
                <PlusIcon className="w-6 h-6"/>
            </button>
        </header>
      <main className="flex-grow p-2 overflow-y-auto">
        {sessions.length > 0 ? (
            <ul>
                {sessions.map(session => (
                    <SessionListItem 
                        key={session.id} 
                        session={session} 
                        onSelect={() => onSelectSession(session)}
                        onDelete={() => onDeleteSession(session.id)}
                    />
                ))}
            </ul>
        ) : (
            <div className="text-center text-gray-500 mt-20 px-4 flex flex-col items-center">
                 <p>Bạn chưa có cuộc trò chuyện nào với {character.name}.</p>
                 <button 
                    onClick={onCreateNew}
                    className="mt-4 px-5 py-2.5 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition-colors"
                >
                    Bắt đầu cuộc trò chuyện đầu tiên
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default SessionList;