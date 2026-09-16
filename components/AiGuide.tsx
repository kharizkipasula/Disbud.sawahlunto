
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Camera, Image as ImageIcon } from 'lucide-react';
import { ChatMessage } from '../types';
import { askHeritageGuide } from '../services/gemini';

const AiGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Halo! I am your AI Heritage Guide. Ask me anything, or send me a photo of a building/artifact and I\'ll tell you its history!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: inputValue || "Analyze this image for me.", 
      imageUrl: selectedImage || undefined 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    const currentImage = selectedImage;
    
    setInputValue('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const responseText = await askHeritageGuide(userMsg.text, currentImage || undefined);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the archives right now.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-40 bg-heritage-gold text-white p-4 rounded-full shadow-2xl hover:bg-yellow-600 transition-all transform hover:scale-110 flex items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open AI Guide"
      >
        <Sparkles className="w-6 h-6" />
        <span className="font-bold hidden md:inline pr-2">Ask Guide</span>
      </button>

      {/* Chat Interface */}
      <div
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[95vw] md:w-96 bg-white rounded-xl shadow-2xl z-50 flex flex-col transition-all duration-300 origin-bottom-right border border-gray-100 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
        style={{ maxHeight: '600px', height: '80vh' }}
      >
        {/* Header */}
        <div className="bg-heritage-dark text-white p-4 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-heritage-gold p-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold">Heritage Guide</h3>
              <p className="text-xs text-gray-300">Powered by Gemini AI Vision</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.imageUrl && (
                <div className="mb-2 max-w-[70%] rounded-lg overflow-hidden border-2 border-white shadow-sm">
                  <img src={msg.imageUrl} alt="User upload" className="w-full h-auto" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-heritage-dark text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                } ${msg.isError ? 'border-red-300 bg-red-50 text-red-800' : ''}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-heritage-gold" />
                <span className="text-xs text-gray-500">Analyzing archives...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
               <img src={selectedImage} className="w-16 h-16 object-cover rounded-lg border-2 border-heritage-gold shadow-md" alt="Preview" />
               <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm">
                 <X className="w-3 h-3" />
               </button>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-heritage-gold transition-colors"
            >
              <Camera className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask or describe image..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-heritage-gold focus:ring-1 focus:ring-heritage-gold"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!inputValue.trim() && !selectedImage)}
              className="bg-heritage-gold text-white p-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiGuide;
