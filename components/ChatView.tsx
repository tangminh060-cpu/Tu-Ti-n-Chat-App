
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character, UserPersona, Message, PersonaProfile, ChatSession } from '../types';
import { GoogleGenAI, Chat } from '@google/genai';
import { BackArrowIcon, SendIcon, UsersIcon, HeartIcon, GiftIcon, CloseIcon, TrashIcon, CalendarDaysIcon, UserIcon, RefreshIcon, ClipboardIcon, CheckIcon, SparklesIcon, CpuChipIcon, PlusIcon } from './icons';
import { createSystemPrompt } from '../services/geminiService';
import EditableField from './EditableField';

interface ChatViewProps {
  character: Character;
  userPersona: UserPersona;
  personaProfile: PersonaProfile | null;
  session: ChatSession;
  onSaveMessages: (messages: Message[]) => void;
  onBack: () => void;
  onSwitchPersona: () => void;
  onViewProfile: (character: Character) => void;
  onViewRelationship: (character: Character) => void;
  onAffectionChange: (characterId: string, change: number) => void;
  onOpenPersonaProfile: () => void;
  onModelChange: (characterId: string, newModel: string) => void;
}

interface HeartButtonProps {
    character: Character;
    onClick: () => void;
    onAffectionEdit: (value: string | number) => void;
}
const HeartButton: React.FC<HeartButtonProps> = ({ character, onClick, onAffectionEdit }) => {
    const affection = character.stats.tinhCam;
    const isHatred = affection < 0;

    // Determine the fill percentage. For love, cap visual at 100. For hatred, use absolute value up to 100.
    const fillPercentage = isHatred ? Math.min(Math.abs(affection), 100) : Math.min(affection, 100);
    const gradientClass = isHatred ? "from-red-600 to-purple-800" : "from-sky-500 to-sky-300";

    const heartSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`;
    const maskStyle = {
        maskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(heartSVG)}')`,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(heartSVG)}')`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain',
    };

    return (
        <div onClick={onClick} className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center group" title="Xem cấp độ quan hệ">
            <div className="absolute inset-0" style={maskStyle}>
                <div className="w-full h-full bg-blue-400/20 backdrop-blur-sm"></div>
                <div 
                    className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${gradientClass} transition-all duration-500`}
                    style={{ height: `${fillPercentage}%` }}
                ></div>
            </div>
             <div 
                className="relative z-10 drop-shadow-lg"
                onClick={(e) => { e.stopPropagation(); }}
            >
                <EditableField 
                    value={character.stats.tinhCam} 
                    onSave={onAffectionEdit} 
                    inputType="number"
                >
                    <span className="text-white font-bold text-base">{character.stats.tinhCam}</span>
                </EditableField>
            </div>
        </div>
    );
};

const MessageEditor: React.FC<{
    initialText: string;
    onSave: (newText: string) => void;
    onCancel: () => void;
}> = ({ initialText, onSave, onCancel }) => {
    const [text, setText] = useState(initialText);

    const handleSave = () => {
        if (text.trim() && text.trim() !== initialText.trim()) {
            onSave(text.trim());
        } else {
            onCancel();
        }
    };

    return (
        <div className="flex w-full my-4 justify-end">
            <div className="flex flex-col items-end gap-3">
                <div className={`w-full max-w-[80%]`}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                        rows={3}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={onCancel} className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded-md font-semibold">Hủy</button>
                        <button onClick={handleSave} className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-400 text-black rounded-md font-semibold">Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface EventCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (eventData: { activity: string, location: string, time: string, description: string }) => void;
}
const EventCreationModal: React.FC<EventCreationModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [eventData, setEventData] = useState({ activity: '', location: '', time: '', description: '' });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (eventData.activity.trim() && eventData.location.trim() && eventData.time.trim()) {
            onCreate(eventData);
            setEventData({ activity: '', location: '', time: '', description: '' }); // Reset form
        }
    };

    return (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4"
          onClick={onClose}
        >
          <div 
            className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <header className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Tạo Sự Kiện Mới</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
                <CloseIcon className="w-6 h-6" />
              </button>
            </header>
            <main className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="activity" className="block text-sm font-medium text-gray-300 mb-1">Hoạt Động</label>
                  <input type="text" name="activity" id="activity" value={eventData.activity} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Địa Điểm</label>
                  <input type="text" name="location" id="location" value={eventData.location} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">Thời gian diễn ra</label>
                  <input type="text" name="time" id="time" value={eventData.time} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Mô Tả</label>
                  <textarea name="description" id="description" value={eventData.description} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                <footer className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold">Hủy</button>
                    <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md font-semibold">Tạo</button>
                </footer>
              </form>
            </main>
          </div>
        </div>
    );
};

interface GiftCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (giftData: { name: string, quantity: number, description: string }) => void;
}
const GiftCreationModal: React.FC<GiftCreationModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [giftData, setGiftData] = useState({ name: '', quantity: 1, description: '' });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGiftData(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value, 10) || 1 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (giftData.name.trim() && giftData.quantity > 0) {
            onCreate(giftData);
            setGiftData({ name: '', quantity: 1, description: '' }); // Reset form
            onClose();
        }
    };

    return (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4"
          onClick={onClose}
        >
          <div 
            className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <header className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Tặng Quà</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
                <CloseIcon className="w-6 h-6" />
              </button>
            </header>
            <main className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Tên Quà tặng</label>
                      <input type="text" name="name" id="name" value={giftData.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                    </div>
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">Số lượng</label>
                      <input type="number" name="quantity" id="quantity" value={giftData.quantity} onChange={handleChange} min="1" className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                    </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Mô Tả</label>
                  <textarea name="description" id="description" value={giftData.description} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Mô tả ngắn về món quà (tùy chọn)..." />
                </div>
                <footer className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold">Hủy</button>
                    <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md font-semibold">Tặng</button>
                </footer>
              </form>
            </main>
          </div>
        </div>
    );
};

interface ScenarioCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (scenarioText: string) => void;
}
const ScenarioCreationModal: React.FC<ScenarioCreationModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [scenario, setScenario] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (scenario.trim()) {
            onCreate(scenario.trim());
            setScenario(''); // Reset form
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Tạo Kịch Bản</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><CloseIcon className="w-6 h-6" /></button>
                </header>
                <main className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="scenario-text" className="block text-sm font-medium text-gray-300 mb-1">Mô tả kịch bản</label>
                            <textarea
                                name="scenario-text"
                                id="scenario-text"
                                value={scenario}
                                onChange={(e) => setScenario(e.target.value)}
                                rows={5}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Nhập bối cảnh hoặc tình huống bạn muốn nhân vật phản ứng..."
                                required
                            />
                        </div>
                        <footer className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold">Hủy</button>
                            <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md font-semibold">Bắt đầu</button>
                        </footer>
                    </form>
                </main>
            </div>
        </div>
    );
};


const ActionMenu: React.FC<{
    onSwitchPersona: () => void;
    onOpenPersonaProfile: () => void;
    onScenario: () => void;
    onEvent: () => void;
    onGift: () => void;
}> = ({ onSwitchPersona, onOpenPersonaProfile, onScenario, onEvent, onGift }) => {
    
    const ActionButton: React.FC<{
        icon: React.ReactElement<{ className?: string }>;
        text: string;
        onClick: () => void;
    }> = ({ icon, text, onClick }) => (
        <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-3 text-center bg-gray-700/80 hover:bg-gray-600/80 rounded-lg transition-colors">
            {React.cloneElement(icon, { className: 'w-6 h-6 text-gray-300' })}
            <span className="text-xs font-semibold">{text}</span>
        </button>
    );

    return (
        <div className="absolute bottom-full left-4 right-4 mb-2 p-3 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg grid grid-cols-5 gap-3">
            <ActionButton icon={<UsersIcon />} text="Switch Persona" onClick={onSwitchPersona} />
            <ActionButton icon={<UserIcon />} text="Persona Profile" onClick={onOpenPersonaProfile} />
            <ActionButton icon={<SparklesIcon />} text="Tạo Kịch Bản" onClick={onScenario} />
            <ActionButton icon={<CalendarDaysIcon />} text="Tạo Sự Kiện" onClick={onEvent} />
            <ActionButton icon={<GiftIcon />} text="Tặng Quà" onClick={onGift} />
        </div>
    );
};


const ChatView: React.FC<ChatViewProps> = ({ character, userPersona, personaProfile, session, onSaveMessages, onBack, onSwitchPersona, onViewProfile, onViewRelationship, onAffectionChange, onOpenPersonaProfile, onModelChange }) => {
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    onSaveMessages(messages);
  }, [messages, onSaveMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);
  
  const getNewChatSession = useCallback((messageHistory: Message[]) => {
    if (!process.env.API_KEY) {
        throw new Error("API Key not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = createSystemPrompt(character, userPersona, personaProfile);

    const cleanHistory = messageHistory.filter(m => m.id !== 'error-key' && !m.id.startsWith('bot-greeting-'));

    const processedHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    for (const msg of cleanHistory) {
        let role: 'user' | 'model';
        let text = msg.text;

        if (msg.sender === 'user') {
            role = 'user';
        } else if (msg.sender === 'event') {
            role = 'user';
            text = `[BỐI CẢNH]\n${msg.text}\n[KẾT THÚC BỐI CẢNH]`;
        } else { // 'bot'
            role = 'model';
        }

        const lastEntry = processedHistory.length > 0 ? processedHistory[processedHistory.length - 1] : null;

        if (lastEntry && lastEntry.role === 'user' && role === 'user') {
            lastEntry.parts[0].text += `\n\n${text}`;
        } else {
            processedHistory.push({ role, parts: [{ text }] });
        }
    }

    const modelToUse = character.model === 'default' ? 'gemini-2.5-flash' : (character.model || 'gemini-2.5-flash');
    return ai.chats.create({
        model: modelToUse,
        config: { systemInstruction },
        history: processedHistory
    });
  }, [character, userPersona, personaProfile]);

  const runGeminiStream = async (prompt: string, historyContext: Message[]) => {
    setIsLoading(true);
    const botMessageId = `bot-stream-${Date.now()}`;
    setMessages(prev => [...prev, { id: botMessageId, text: "", sender: 'bot', timestamp: Date.now() }]);

    try {
        const chatSession = getNewChatSession(historyContext);
        const stream = await chatSession.sendMessageStream({ message: prompt });
        
        let botResponseText = "";
        for await (const chunk of stream) {
            const chunkText = chunk?.text;
            if (chunkText) {
                botResponseText += chunkText;
                setMessages(prev => {
                    return prev.map(m => 
                        m.id === botMessageId 
                        ? { ...m, text: botResponseText.replace(/\{"affection_change":\s*(-?\d+)\}/g, '').trim() } 
                        : m
                    );
                });
            }
        }
        
        let affectionChange = 0;
        const jsonRegex = /\{"affection_change":\s*(-?\d+)\}/g;
        const matches = botResponseText.match(jsonRegex);

        if (matches && matches.length > 0) {
            try {
                const lastMatch = matches[matches.length - 1];
                const parsed = JSON.parse(lastMatch);
                affectionChange = parsed.affection_change || 0;
            } catch (e) {
                console.error("Failed to parse affection JSON from stream:", e);
            }
        }

        if (affectionChange !== 0) {
            onAffectionChange(character.id, affectionChange);
        }
      
        const finalText = botResponseText.replace(jsonRegex, '').trim();
        if (!botResponseText.trim()) {
            const errorMessage = `*${character.name} dường như không biết phải nói gì... (Phản hồi trống từ AI)*`;
            setMessages(prev => prev.map(m => m.id === botMessageId ? {...m, text: errorMessage} : m));
        } else if (!finalText) {
            setMessages(prev => prev.filter(m => m.id !== botMessageId));
        }

    } catch (error) {
        console.error("Error in Gemini Stream:", error);
         if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("Requested entity was not found"))) {
            const errorMessage = "Lỗi xác thực API Key. Vui lòng kiểm tra lại API key của bạn trong cài đặt môi trường (environment variable).";
            setMessages(prev => prev.map(m => m.id === botMessageId ? {...m, text: errorMessage} : m));
        } else {
            const errorMessage = "Xin lỗi, đã có lỗi xảy ra khi giao tiếp với AI. Vui lòng thử lại.";
            setMessages(prev => prev.map(m => m.id === botMessageId ? {...m, text: errorMessage} : m));
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMessage: Message = { id: `user-${Date.now()}`, text, sender: 'user', timestamp: Date.now() };
    
    const historyContext = [...messages]; 
    setMessages(prev => [...prev, userMessage]);
    
    await runGeminiStream(text, historyContext);
  };
  

  const handleSaveEdit = async (messageId: string, newText: string) => {
    setEditingMessageId(null);
    const editedIndex = messages.findIndex(msg => msg.id === messageId);
    if (editedIndex === -1) return;

    const updatedMessage: Message = { ...messages[editedIndex], text: newText, timestamp: Date.now() };
    const newHistory = [...messages.slice(0, editedIndex), updatedMessage];
    setMessages(newHistory);

    const historyContext = messages.slice(0, editedIndex);
    await runGeminiStream(newText, historyContext);
  };

  const handleRegenerateResponse = async () => {
    if (isLoading) return;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.sender !== 'bot') return;

    const historyBeforeBotResponse = messages.slice(0, -1);
    if (historyBeforeBotResponse.length === 0) return;
    
    const lastUserTurn = historyBeforeBotResponse[historyBeforeBotResponse.length - 1];
    
    if (lastUserTurn.sender !== 'user' && lastUserTurn.sender !== 'event') {
        return;
    }

    const historyContext = historyBeforeBotResponse.slice(0, -1);
    setMessages(historyBeforeBotResponse);
    await runGeminiStream(lastUserTurn.text, historyContext);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleSendGift = (giftData: { name: string; quantity: number; description: string }) => {
    const { name, quantity, description } = giftData;
    const giftMessage = `*Bạn lấy ra ${quantity} "${name}" và đưa cho ${character.name}.${description ? ` ${description}` : ''}*`;
    sendMessage(giftMessage);
  };
  
  const handleAffectionEdit = (newValue: string | number) => {
    const newAffection = Number(newValue);
    if (isNaN(newAffection) || newAffection < -100 || newAffection > 500) {
        alert("Mức độ hảo cảm phải từ -100 đến 500.");
        return;
    }
    const currentAffection = character.stats.tinhCam;
    const change = newAffection - currentAffection;
    onAffectionChange(character.id, change);
  };
  
  const handleCreateEvent = (eventData: { activity: string, location: string, time: string, description: string }) => {
    const { activity, location, time, description } = eventData;
    const eventText = `--- SỰ KIỆN ---\nHoạt Động: ${activity}\nĐịa Điểm: ${location}\nThời Gian: ${time}${description ? `\nMô Tả: ${description}` : ''}\n*Bạn và ${character.name} đã cùng nhau trải qua sự kiện này.*`;
    const newEventMessage: Message = { id: `event-${Date.now()}`, text: eventText, sender: 'event', timestamp: Date.now() };
    setMessages(prev => [...prev, newEventMessage]);
    setIsEventModalOpen(false);
  };
  
  const handleCreateScenario = (scenarioText: string) => {
    const scenarioMessageText = `--- KỊCH BẢN ---\n${scenarioText}\n*Bối cảnh đã được thiết lập. Bạn và ${character.name} đang ở trong tình huống này.*`;
    const newScenarioMessage: Message = { id: `event-${Date.now()}`, text: scenarioMessageText, sender: 'event', timestamp: Date.now() };
    setMessages(prev => [...prev, newScenarioMessage]);
    setIsScenarioModalOpen(false);
  };

  const handleDeleteMessage = (messageId: string) => {
    const messageToDelete = messages.find(m => m.id === messageId);
    if (messageToDelete && messageToDelete.sender === 'event') {
        setMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };

  const handleCopyText = (text: string, messageId: string) => {
    if (!navigator.clipboard) {
        console.error("Clipboard API not available");
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        setCopiedMessageId(messageId);
        setTimeout(() => {
            setCopiedMessageId(null);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  const handleModelToggle = () => {
    const models = ['default', 'gemini-2.5-flash', 'gemini-2.5-pro'];
    const currentIndex = models.indexOf(character.model);
    const nextIndex = (currentIndex + 1) % models.length;
    onModelChange(character.id, models[nextIndex]);
  };
  
  const getModelDisplayName = (model: string) => {
    if (model.includes('pro')) return 'Pro';
    if (model.includes('flash')) return 'Flash';
    return 'Mặc định';
  };

  const modelName = getModelDisplayName(character.model);
  
  const models = ['default', 'gemini-2.5-flash', 'gemini-2.5-pro'];
  const currentIndex = models.indexOf(character.model);
  const nextModelName = getModelDisplayName(models[(currentIndex + 1) % models.length]);

  return (
    <div className="relative flex flex-col h-full bg-black text-white w-full">
        <EventCreationModal 
            isOpen={isEventModalOpen}
            onClose={() => setIsEventModalOpen(false)}
            onCreate={eventData => {
                handleCreateEvent(eventData);
                setIsActionMenuOpen(false);
            }}
        />
        <GiftCreationModal
            isOpen={isGiftModalOpen}
            onClose={() => setIsGiftModalOpen(false)}
            onCreate={giftData => {
                handleSendGift(giftData);
                setIsActionMenuOpen(false);
            }}
        />
        <ScenarioCreationModal
            isOpen={isScenarioModalOpen}
            onClose={() => setIsScenarioModalOpen(false)}
            onCreate={scenario => {
                handleCreateScenario(scenario);
                setIsActionMenuOpen(false);
            }}
        />
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <img src={character.imageUrl} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
            <header className="flex items-center p-4 bg-black/30 backdrop-blur-sm gap-3 flex-shrink-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 flex-shrink-0">
                    <BackArrowIcon className="w-6 h-6" />
                </button>
                <HeartButton character={character} onClick={() => onViewRelationship(character)} onAffectionEdit={handleAffectionEdit} />
                <button onClick={() => onViewProfile(character)} className="text-left flex-grow min-w-0">
                    <h2 className="font-bold text-lg truncate">{character.name}</h2>
                    <p className="text-xs text-gray-400 truncate">{character.tag}</p>
                </button>
                 <button onClick={handleModelToggle} className="flex-shrink-0 flex items-center gap-1.5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title={`Chuyển sang ${nextModelName}`}>
                    <CpuChipIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-xs font-semibold">{modelName}</span>
                </button>
            </header>
            
            <main className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const isLastMessage = index === messages.length - 1;

                        if (msg.id === editingMessageId && msg.sender === 'user') {
                            return <MessageEditor 
                                key={msg.id}
                                initialText={msg.text}
                                onSave={(newText) => handleSaveEdit(msg.id, newText)}
                                onCancel={() => setEditingMessageId(null)}
                            />;
                        }
                        if (msg.sender === 'event') {
                            return (
                                <div key={msg.id} className="my-4 group relative">
                                    <div className="text-center text-xs text-gray-400 p-3 bg-gray-800/50 rounded-lg border border-dashed border-gray-600 whitespace-pre-wrap">
                                        {msg.text}
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="absolute top-1 right-1 p-1 bg-gray-700 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Xóa sự kiện"
                                    >
                                        <TrashIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        }
                        const isUser = msg.sender === 'user';
                        return (
                            <div key={msg.id} className={`flex items-end gap-2.5 group ${isUser ? 'flex-row-reverse' : ''}`}>
                                <img 
                                    src={isUser ? userPersona.imageUrl : character.imageUrl} 
                                    alt={isUser ? userPersona.name : character.name}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div 
                                  className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 rounded-2xl ${
                                      isUser 
                                      ? 'bg-slate-200 text-black rounded-br-none' 
                                      : 'bg-gray-800 text-white rounded-bl-none'
                                  }`}
                                  onClick={() => {
                                      if (isUser && !isLoading) {
                                          setEditingMessageId(msg.id);
                                      }
                                  }}
                                  title={isUser ? 'Click to edit' : ''}
                                >
                                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {msg.text || (
                                      <span className="inline-block w-1 h-4 bg-white/50 animate-pulse rounded-full"></span>
                                    )}
                                  </p>
                                </div>
                                <div className={`self-center flex-shrink-0 flex items-center gap-1 transition-opacity opacity-0 group-hover:opacity-100 focus-within:opacity-100`}>
                                    {msg.text && (
                                        <button 
                                            onClick={() => handleCopyText(msg.text, msg.id)} 
                                            title={copiedMessageId === msg.id ? "Đã sao chép!" : "Sao chép văn bản"} 
                                            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700"
                                        >
                                            {copiedMessageId === msg.id ? (
                                                <CheckIcon className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <ClipboardIcon className="w-4 h-4" />
                                            )}
                                        </button>
                                    )}

                                    {isLastMessage && msg.sender === 'bot' && !isLoading && (
                                      <button onClick={handleRegenerateResponse} title="Tạo lại phản hồi" className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700">
                                          <RefreshIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </main>

            <footer className="relative p-4 bg-black/50 backdrop-blur-sm flex-shrink-0">
                {isActionMenuOpen && (
                    <ActionMenu
                        onSwitchPersona={() => { onSwitchPersona(); setIsActionMenuOpen(false); }}
                        onOpenPersonaProfile={() => { onOpenPersonaProfile(); setIsActionMenuOpen(false); }}
                        onScenario={() => setIsScenarioModalOpen(true)}
                        onEvent={() => setIsEventModalOpen(true)}
                        onGift={() => setIsGiftModalOpen(true)}
                    />
                )}
                 <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
                    <button 
                        type="button" 
                        onClick={() => setIsActionMenuOpen(prev => !prev)} 
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors" 
                        title="More Actions"
                    >
                        <PlusIcon className="w-6 h-6 text-gray-300" />
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Message ${character.name}`}
                        className="flex-grow bg-gray-800 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !inputValue.trim()} className="p-2 rounded-full bg-yellow-500 disabled:bg-gray-600 hover:bg-yellow-400 transition-colors">
                        <SendIcon className="w-6 h-6 text-black" />
                    </button>
                </form>
            </footer>
        </div>
    </div>
  );
};

export default ChatView;
