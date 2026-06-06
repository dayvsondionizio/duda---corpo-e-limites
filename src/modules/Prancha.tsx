import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, X, Send, Search, Plus, Sparkles, Loader2, HelpCircle, AlertCircle, Trash2, Home } from 'lucide-react';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';
import { AAC_CATEGORIES } from '../data';
import { generateContent } from '../services/GroqService';

interface Props {
  settings: TherapistSettings;
  say: (t: string, force?: boolean) => void;
  onNavigate: (s: any) => void;
  avatar: AvatarConfig;
}

interface SymbolItem {
  id: string;
  label: string;
  icon: string;
  categoryId?: string;
  isCustom?: boolean;
}

// Map color tokens for premium aesthetics for each category
const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string; ring: string; accent: string; cardBg: string }> = {
  basic: { bg: 'bg-purple/10', border: 'border-purple/20', text: 'text-purple', ring: 'focus:ring-purple/20', accent: 'bg-purple', cardBg: 'hover:bg-purple/5 hover:border-purple/40' },
  needs: { bg: 'bg-rose/10', border: 'border-rose/20', text: 'text-rose', ring: 'focus:ring-rose/20', accent: 'bg-rose', cardBg: 'hover:bg-rose/5 hover:border-rose/40' },
  emotions: { bg: 'bg-yellow/15', border: 'border-yellow/30', text: 'text-yellow-dark', ring: 'focus:ring-yellow/20', accent: 'bg-yellow', cardBg: 'hover:bg-yellow/5 hover:border-yellow/40' },
  people: { bg: 'bg-blue/10', border: 'border-blue/20', text: 'text-blue', ring: 'focus:ring-blue/20', accent: 'bg-blue', cardBg: 'hover:bg-blue/5 hover:border-blue/40' },
  actions: { bg: 'bg-green/10', border: 'border-green/20', text: 'text-green', ring: 'focus:ring-green/20', accent: 'bg-green', cardBg: 'hover:bg-green/5 hover:border-green/40' },
  things: { bg: 'bg-peach/10', border: 'border-peach/20', text: 'text-peach', ring: 'focus:ring-peach/20', accent: 'bg-peach', cardBg: 'hover:bg-peach/5 hover:border-peach/40' },
  places: { bg: 'bg-teal/10', border: 'border-teal/20', text: 'text-teal', ring: 'focus:ring-teal/20', accent: 'bg-teal', cardBg: 'hover:bg-teal/5 hover:border-teal/40' },
  descriptors: { bg: 'bg-sage/15', border: 'border-sage/30', text: 'text-sage-dark', ring: 'focus:ring-sage/20', accent: 'bg-sage', cardBg: 'hover:bg-sage/5 hover:border-sage/40' },
  questions: { bg: 'bg-purple/10', border: 'border-purple/20', text: 'text-purple', ring: 'focus:ring-purple/20', accent: 'bg-purple', cardBg: 'hover:bg-purple/5 hover:border-purple/40' },
  custom: { bg: 'bg-teal/10', border: 'border-teal/20', text: 'text-teal', ring: 'focus:ring-teal/20', accent: 'bg-teal', cardBg: 'hover:bg-teal/5 hover:border-teal/40' },
};

const DEFAULT_EMOJI_PICKER = ['🧸','🍕','🥤','🚗','🎨','⚽','📱','🍎','🍭','🐶','🐱','🌈','☀️','⭐','🏠','🏫','👩','👨','👵','👴','🤝','🚨','🚽','🩹','🛌','❓','🟢','🔴','👈','👉'];

export function ModulePrancha({ settings, say, onNavigate, avatar }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(AAC_CATEGORIES[0].id);
  const [sentence, setSentence] = useState<SymbolItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom symbols
  const [customSymbols, setCustomSymbols] = useState<SymbolItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newEmoji, setNewEmoji] = useState('🧸');
  const [newCategory, setNewCategory] = useState(AAC_CATEGORIES[0].id);

  // AI Expander State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Load custom symbols
  useEffect(() => {
    const saved = localStorage.getItem('corpo_e_limites_custom_symbols');
    if (saved) {
      try {
        setCustomSymbols(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao ler símbolos customizados:', e);
      }
    }
  }, []);

  // Combined list of categories, dynamically adding a "Personalizados" category if custom symbols exist
  const categories = useMemo(() => {
    const list = [...AAC_CATEGORIES];
    if (customSymbols.length > 0) {
      list.push({
        id: 'custom',
        label: 'Criados',
        icon: '✨',
        items: []
      });
    }
    return list;
  }, [customSymbols]);

  // Combine static and custom symbols
  const symbolsByCategory = useMemo(() => {
    const map: Record<string, SymbolItem[]> = {};
    
    // Fill static ones
    AAC_CATEGORIES.forEach(cat => {
      map[cat.id] = cat.items.map(item => ({ ...item, categoryId: cat.id }));
    });

    // Fill custom ones
    customSymbols.forEach(sym => {
      const catId = sym.categoryId || 'custom';
      if (!map[catId]) {
        map[catId] = [];
      }
      map[catId].push(sym);
    });

    return map;
  }, [customSymbols]);

  // Get currently displayed symbols based on selected category or search query
  const displayedSymbols = useMemo(() => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const all: SymbolItem[] = [];
      Object.values(symbolsByCategory).forEach((list: SymbolItem[]) => {
        list.forEach(item => {
          if (item.label.toLowerCase().includes(query)) {
            all.push(item);
          }
        });
      });
      return all;
    }

    if (selectedCategory === 'custom') {
      return customSymbols;
    }

    return symbolsByCategory[selectedCategory] || [];
  }, [selectedCategory, symbolsByCategory, searchQuery, customSymbols]);

  const addToSentence = useCallback((item: SymbolItem) => {
    setSentence(prev => [...prev, item]);
    say(item.label, true);
    setAiResponse(null); // Clear previous AI translation
  }, [say]);

  const removeLast = useCallback(() => {
    setSentence(prev => prev.slice(0, -1));
    setAiResponse(null);
  }, []);

  const clearSentence = useCallback(() => {
    setSentence([]);
    setAiResponse(null);
  }, []);

  const speakSentence = useCallback(() => {
    if (sentence.length === 0) return;
    const text = sentence.map(s => s.label).join(' ');
    say(text, true);
  }, [sentence, say]);

  const speakQuickNeed = useCallback((label: string, text: string) => {
    say(text, true);
  }, [say]);

  // Add custom symbol
  const handleCreateSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newItem: SymbolItem = {
      id: `custom_${Date.now()}`,
      label: newLabel.trim(),
      icon: newEmoji,
      categoryId: newCategory,
      isCustom: true
    };

    const updated = [...customSymbols, newItem];
    setCustomSymbols(updated);
    localStorage.setItem('corpo_e_limites_custom_symbols', JSON.stringify(updated));

    // Reset form
    setNewLabel('');
    setIsModalOpen(false);
    setSelectedCategory(newCategory); // switch to the target category
    say('Símbolo criado com sucesso!');
  };

  // Delete custom symbol
  const handleDeleteSymbol = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent adding to sentence
    if (confirm('Deseja realmente apagar este símbolo?')) {
      const updated = customSymbols.filter(s => s.id !== id);
      setCustomSymbols(updated);
      localStorage.setItem('corpo_e_limites_custom_symbols', JSON.stringify(updated));
      
      // If we deleted the last custom symbol and were in 'custom' category, fallback
      if (updated.length === 0 && selectedCategory === 'custom') {
        setSelectedCategory(AAC_CATEGORIES[0].id);
      }
      say('Símbolo apagado.');
    }
  };

  // AI Phrase Expander
  const handleAiExpand = async () => {
    if (sentence.length === 0) return;
    if (!settings.groqApiKey) {
      say('Adicione a chave da Groq para habilitar o assistente inteligente.');
      alert('Por favor, configure a API Key da Groq nas configurações do terapeuta para ativar esta função.');
      return;
    }

    setAiLoading(true);
    const symbolsText = sentence.map(s => s.label).join(' ');

    const prompt = `A partir do perfil da criança: "${settings.childProfile || 'Geral'}" e da sequência de símbolos de comunicação: "${symbolsText}", expanda em uma frase em português natural na primeira pessoa, empática e de linguagem acessível (máximo 12 palavras) para o sintetizador de voz do aplicativo falar. Retorne APENAS a frase expandida, sem aspas, sem explicações antes ou depois.`;

    try {
      const response = await generateContent(settings.groqApiKey, prompt);
      const cleaned = response.trim().replace(/^["']|["']$/g, '');
      setAiResponse(cleaned);
      say(cleaned, true);
    } catch (e) {
      console.error(e);
      say('Erro ao expandir frase.');
    } finally {
      setAiLoading(false);
    }
  };

  const activeStyle = CATEGORY_STYLES[selectedCategory] || CATEGORY_STYLES.basic;

  return (
    <div className="space-y-6 flex flex-col min-h-[80vh]">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl text-teal font-extrabold flex items-center gap-3">
            Prancha de Símbolos 💬
          </h2>
          <p className="text-muted text-sm md:text-base">Monte frases combinando símbolos e toque para reproduzir o som!</p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setIsModalOpen(true)}
            className="btn-secondary px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-dashed border-2 hover:border-solid">
            <Plus size={16} /> Criar Símbolo
          </button>
          <button onClick={() => onNavigate('home')}
            className="btn-ghost px-4 py-2.5 text-xs font-bold flex items-center gap-2">
            <Home size={16} /> Voltar ao HUB
          </button>
        </div>
      </header>

      {/* Sentence Builder & IA Expander */}
      <div className="card p-5 bg-gradient-to-r from-teal/5 to-white/90 border border-teal/15 shadow-xl relative space-y-4">
        
        {/* Built Sentence Bar */}
        <div className="min-h-[100px] flex items-center gap-3 bg-white/60 backdrop-blur rounded-[2rem] border border-border/80 p-4 overflow-x-auto custom-scrollbar">
          {sentence.length === 0 ? (
            <div className="flex items-center gap-2 text-muted text-sm italic mx-auto">
              <HelpCircle size={16} className="text-teal/40" />
              <span>Toque nos símbolos abaixo para montar sua frase...</span>
            </div>
          ) : (
            <div className="flex gap-2 flex-1">
              <AnimatePresence>
                {sentence.map((s, idx) => (
                  <motion.button
                    key={`${s.id}-${idx}`}
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -10 }}
                    onClick={() => say(s.label, true)}
                    className="flex flex-col items-center justify-center p-3 bg-teal/10 rounded-2xl border border-teal/20 min-w-[70px] hover:bg-teal/20 transition-all cursor-pointer"
                  >
                    <span className="text-3xl">{s.icon}</span>
                    <span className="text-[9px] font-black text-teal-dark uppercase text-center mt-1.5 truncate max-w-[65px]">{s.label}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}

          {sentence.length > 0 && (
            <div className="flex gap-2 shrink-0 ml-2">
              <button onClick={removeLast} title="Apagar último"
                className="p-3 bg-warm/80 text-muted hover:text-rose hover:bg-rose/10 rounded-2xl border border-border/70 transition-all cursor-pointer">
                <X size={18} />
              </button>
              <button onClick={clearSentence} title="Limpar tudo"
                className="p-3 bg-rose/10 text-rose hover:bg-rose/25 rounded-2xl border border-rose/20 transition-all cursor-pointer">
                Apagar Tudo
              </button>
              <button onClick={speakSentence} title="Falar frase"
                className="btn-primary p-4 rounded-2xl flex items-center justify-center gap-2">
                <Volume2 size={20} />
                <span className="text-xs font-black uppercase tracking-wider">Falar</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Expander Section */}
        {sentence.length > 0 && (
          <div className="pt-2 border-t border-border/40 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <button
              onClick={handleAiExpand}
              disabled={aiLoading}
              className="btn-secondary px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-teal border border-teal/20 bg-white/70 hover:bg-teal/5 self-start shadow-sm shrink-0"
            >
              {aiLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} className="text-yellow-dark" />
              )}
              <span>Falar Frase Completa com IA</span>
            </button>

            <AnimatePresence>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 bg-white/80 border border-teal/10 rounded-2xl px-4 py-3 flex items-start gap-2.5 text-xs text-teal-dark font-medium shadow-inner"
                >
                  <Sparkles size={14} className="text-yellow-dark shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Tradução Inteligente:</p>
                    <p className="text-sm font-semibold italic">"{aiResponse}"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Main Grid & Category Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Categories Bar / Column */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide md:max-h-[60vh] md:overflow-y-auto pr-1">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id && searchQuery === '';
            const style = CATEGORY_STYLES[cat.id] || CATEGORY_STYLES.basic;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer border text-left md:w-full select-none
                  ${isSelected 
                    ? `${style.accent} text-white border-transparent shadow-md scale-[1.02]`
                    : `bg-white border-border/80 text-muted hover:border-teal/30 hover:bg-cream/40`
                  }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="hidden md:block truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Symbols Grid Side */}
        <div className="md:col-span-3 space-y-4">
          
          {/* Controls: Search and Filters info */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white/60 backdrop-blur border border-border/60 rounded-3xl p-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="text"
                placeholder="Buscar símbolo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-warm/50 border border-border outline-none focus:border-teal text-xs font-bold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-rose"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="text-[10px] font-bold text-muted uppercase tracking-widest px-2 select-none">
              {searchQuery ? 'Resultado da Busca' : `Categoria: ${categories.find(c => c.id === selectedCategory)?.label}`}
            </div>
          </div>

          {/* Grid of Symbol Cards */}
          {displayedSymbols.length === 0 ? (
            <div className="card p-12 text-center text-muted bg-warm/10 border-dashed border-2 flex flex-col items-center justify-center gap-3">
              <AlertCircle size={36} className="text-muted/40" />
              <div>
                <p className="font-bold text-sm">Nenhum símbolo encontrado</p>
                <p className="text-xs text-muted/80 mt-1">
                  {searchQuery ? 'Tente buscar por outra palavra-chave.' : 'Esta categoria está vazia no momento.'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-secondary px-4 py-2 text-xs font-bold mt-2"
                >
                  Criar Símbolo Personalizado
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {displayedSymbols.map(item => {
                const itemCat = item.categoryId || selectedCategory;
                const style = CATEGORY_STYLES[itemCat] || CATEGORY_STYLES.basic;
                return (
                  <button
                    key={item.id}
                    onClick={() => addToSentence(item)}
                    className={`card p-4 flex flex-col items-center justify-center gap-3 border-2 border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 select-none cursor-pointer relative group ${style.cardBg}`}
                  >
                    {/* Delete button for custom items */}
                    {item.isCustom && (
                      <button
                        onClick={(e) => handleDeleteSymbol(item.id, e)}
                        title="Apagar símbolo"
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose/10 text-rose border border-rose/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose hover:text-white"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}

                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300 select-none">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold text-center text-text uppercase tracking-tight truncate w-full leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Emergency/Quick Access Panel (Bottom Bar) */}
      <div className="border-t border-border/50 pt-6 space-y-3">
        <h3 className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2 select-none">
          <AlertCircle size={14} className="text-rose" /> Necessidades Urgentes (Acesso Rápido)
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => speakQuickNeed('Ajuda', 'Preciso de ajuda!')}
            className="p-4 rounded-3xl bg-rose border border-rose/30 text-white font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-rose/15 hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer text-sm md:text-base select-none"
          >
            <span className="text-2xl">🚨</span>
            <span>Preciso de Ajuda</span>
          </button>
          <button
            onClick={() => speakQuickNeed('Banheiro', 'Preciso ir ao banheiro!')}
            className="p-4 rounded-3xl bg-peach border border-peach/30 text-white font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-peach/15 hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer text-sm md:text-base select-none"
          >
            <span className="text-2xl">🚽</span>
            <span>Banheiro</span>
          </button>
          <button
            onClick={() => speakQuickNeed('Dor', 'Estou com dor!')}
            className="p-4 rounded-3xl bg-yellow border border-yellow/30 text-white font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-yellow/15 hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer text-sm md:text-base select-none"
          >
            <span className="text-2xl">🤕</span>
            <span>Estou com Dor</span>
          </button>
          <button
            onClick={() => speakQuickNeed('Água', 'Quero água, por favor!')}
            className="p-4 rounded-3xl bg-blue border border-blue/30 text-white font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-blue/15 hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer text-sm md:text-base select-none"
          >
            <span className="text-2xl">💧</span>
            <span>Quero Água</span>
          </button>
        </div>
      </div>

      {/* modal - criador de símbolos customizados */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card w-full max-w-md p-6 space-y-6 bg-white border border-border overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <h3 className="text-xl font-bold text-teal flex items-center gap-2">
                  <Plus size={18} /> Novo Símbolo Customizado
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-warm rounded-full transition-colors text-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSymbol} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Nome do Símbolo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Abacate, Abraço, Carro..."
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-warm/50 border border-border focus:border-teal outline-none text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Emoji Selecionado: <span className="text-lg ml-1">{newEmoji}</span></label>
                  <div className="grid grid-cols-6 gap-2 p-3 bg-warm/30 rounded-2xl max-h-32 overflow-y-auto border border-border/50">
                    {DEFAULT_EMOJI_PICKER.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewEmoji(emoji)}
                        className={`text-2xl p-1.5 hover:scale-125 transition-transform duration-200 rounded-lg ${newEmoji === emoji ? 'bg-teal/15 ring-2 ring-teal/30' : ''}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-warm/50 border border-border focus:border-teal outline-none text-xs font-bold"
                  >
                    {AAC_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 text-sm font-bold shadow-xl shadow-teal/20"
                >
                  Criar Símbolo ✨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
