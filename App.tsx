import React, { useState, useEffect } from 'react';
import { CVEntry, EducationEntry, Category } from './types';
import { CATEGORIES, ADMISSION_REMINDERS, ICONS } from './constants';
import { generateReflectiveParagraph, generateEducationInsight } from './services/geminiService';

type Tab = 'experiences' | 'education';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('experiences');
  const [entries, setEntries] = useState<CVEntry[]>([]);
  const [eduEntries, setEduEntries] = useState<EducationEntry[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [eduLoadingId, setEduLoadingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '', category: Category.MATH, date: new Date().toISOString().split('T')[0],
    challenge: '', learning: '', link: ''
  });

  const [eduForm, setEduForm] = useState({
    school: '', qualification: '', dates: '', subjects: '', notes: ''
  });

  useEffect(() => {
    const savedExp = localStorage.getItem('cv-vault-exp');
    const savedEdu = localStorage.getItem('cv-vault-edu');
    if (savedExp) try { setEntries(JSON.parse(savedExp)); } catch(e) {}
    if (savedEdu) try { setEduEntries(JSON.parse(savedEdu)); } catch(e) {}
  }, []);

  useEffect(() => { localStorage.setItem('cv-vault-exp', JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem('cv-vault-edu', JSON.stringify(eduEntries)); }, [eduEntries]);

  const handleExpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setEntries([{ ...form, id: crypto.randomUUID() }, ...entries]);
    setForm({ title: '', category: Category.MATH, date: new Date().toISOString().split('T')[0], challenge: '', learning: '', link: '' });
  };

  const handleEduSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.school) return;
    setEduEntries([{ ...eduForm, id: crypto.randomUUID() }, ...eduEntries]);
    setEduForm({ school: '', qualification: '', dates: '', subjects: '', notes: '' });
  };

  const triggerReflection = async (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    setLoadingId(id);
    const reflection = await generateReflectiveParagraph(entry);
    setEntries(prev => prev.map(e => e.id === id ? { ...e, reflection } : e));
    setLoadingId(null);
  };

  const triggerEduInsight = async (id: string) => {
    const entry = eduEntries.find(e => e.id === id);
    if (!entry) return;
    setEduLoadingId(id);
    const insight = await generateEducationInsight(entry);
    setEduEntries(prev => prev.map(e => e.id === id ? { ...e, reflection: insight } : e));
    setEduLoadingId(null);
  };

  // --- INITIALIZATION SCREEN ---
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>

        <div className="max-w-md w-full text-center space-y-10 relative z-10 animate-in fade-in zoom-in duration-700">
          <div className="space-y-6">
            <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/10 transition-transform hover:scale-105 duration-500">
              <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-white tracking-tighter">VAULT.</h1>
              <p className="text-gray-400 text-lg font-medium">Academic Research & Assets</p>
            </div>
          </div>

          <button 
            onClick={() => setIsInitialized(true)}
            className="group relative w-full inline-flex items-center justify-center gap-3 bg-white text-gray-950 px-8 py-6 rounded-3xl font-black text-xl transition-all hover:bg-cyan-50 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-cyan-500/20"
          >
            Access Secure Core
            <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center gap-4">
            <div className="h-[1px] w-12 bg-gray-800"></div>
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.5em] font-black">
              Authorized Session Only
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row text-gray-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-full md:w-[22rem] bg-gray-900/40 backdrop-blur-xl border-r border-gray-800/60 p-8 flex flex-col gap-12 h-auto md:h-screen overflow-y-auto">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 tracking-tighter mb-2">VAULT.</h1>
          <div className="h-1 w-8 bg-cyan-500 rounded-full"></div>
        </div>

        <section className="flex-1 space-y-10">
          <div>
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-gray-800"></span>
              Admissions Guard
            </h2>
            <div className="space-y-4">
              {ADMISSION_REMINDERS.map(reminder => (
                <div key={reminder.id} className="p-5 bg-gray-800/20 rounded-2xl border border-gray-800/50 hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-2 h-2 rounded-full ${
                      reminder.priority === 'High' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 
                      reminder.priority === 'Medium' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    }`} />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{reminder.priority}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">{reminder.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-800/60">
          <button 
            onClick={() => setIsInitialized(false)}
            className="w-full flex items-center justify-center gap-2 bg-gray-800/40 hover:bg-gray-800 text-gray-500 hover:text-white py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest border border-gray-800">
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 overflow-y-auto h-screen px-4 py-12 md:px-16 space-y-12 bg-gradient-to-b from-gray-900/20 to-transparent">
        
        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="bg-gray-900/80 p-1.5 rounded-[1.5rem] inline-flex border border-gray-800 shadow-2xl">
            <button onClick={() => setActiveTab('experiences')}
              className={`px-10 py-3.5 rounded-[1.25rem] text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'experiences' ? 'bg-gray-800 text-cyan-400 shadow-xl border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}>
              Research
            </button>
            <button onClick={() => setActiveTab('education')}
              className={`px-10 py-3.5 rounded-[1.25rem] text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'education' ? 'bg-gray-800 text-purple-400 shadow-xl border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}>
              Academic
            </button>
          </div>
        </div>

        {activeTab === 'experiences' ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Entry Form */}
            <section className="bg-gray-900/40 border border-gray-800/60 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="px-10 py-8 border-b border-gray-800/60 bg-gradient-to-r from-cyan-500/5 to-transparent">
                <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em]">New Research Asset</h3>
              </div>
              <form onSubmit={handleExpSubmit} className="p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Activity Title</label>
                  <input placeholder="e.g. Statistical Analysis of Market Volatility" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-100 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all text-lg font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Domain</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value as Category})} className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-100 outline-none appearance-none font-bold">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Timestamp</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-100 outline-none font-bold" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Technical Complexity</label>
                  <textarea placeholder="Describe the specific problem or sophisticated concept you engaged with..." required value={form.challenge} onChange={e => setForm({...form, challenge: e.target.value})} className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-300 outline-none min-h-[140px] resize-none leading-relaxed" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Key Intellect Gain</label>
                  <textarea placeholder="What was the core academic take-away?" required value={form.learning} onChange={e => setForm({...form, learning: e.target.value})} className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-300 outline-none min-h-[140px] resize-none leading-relaxed" />
                </div>
                <button type="submit" className="md:col-span-2 bg-gradient-to-r from-cyan-600 to-blue-700 py-6 rounded-2xl font-black text-white text-lg shadow-xl shadow-cyan-900/20 hover:shadow-cyan-500/30 active:scale-[0.99] transition-all uppercase tracking-widest">
                  Commit to Vault
                </button>
              </form>
            </section>

            {/* Entries */}
            <div className="space-y-10 pb-32">
              {entries.length === 0 && (
                <div className="text-center py-24 border-2 border-dashed border-gray-800/40 rounded-[3rem]">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Waiting for first research commitment...</p>
                </div>
              )}
              {entries.map(e => (
                <div key={e.id} className="bg-gray-900/40 border border-gray-800/60 rounded-[2.5rem] p-12 hover:border-cyan-500/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[80px] pointer-events-none group-hover:bg-cyan-500/10 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="space-y-4">
                      <span className="px-5 py-2 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-cyan-500/20">{e.category}</span>
                      <h4 className="text-3xl font-bold tracking-tight text-white group-hover:text-cyan-50 transition-colors">{e.title}</h4>
                      <p className="text-xs text-gray-500 font-mono font-bold tracking-widest uppercase">{new Date(e.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => triggerReflection(e.id)} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${loadingId === e.id ? 'bg-indigo-600 text-white animate-pulse' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white'}`}
                      >
                        <ICONS.Sparkles /> {loadingId === e.id ? 'Analyzing...' : 'Refine'}
                      </button>
                      <button onClick={() => setEntries(entries.filter(x => x.id !== e.id))} className="p-4 bg-gray-950/60 rounded-full text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all shadow-xl"><ICONS.Trash /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Technical Context</h5>
                      <p className="text-gray-300 text-sm leading-relaxed antialiased font-medium">{e.challenge}</p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Academic Growth</h5>
                      <p className="text-gray-300 text-sm leading-relaxed antialiased font-medium">{e.learning}</p>
                    </div>
                  </div>

                  {e.reflection && (
                    <div className="mt-12 p-10 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] animate-in slide-in-from-top-6 duration-500 relative">
                      <div className="absolute -top-3 left-8 bg-indigo-500 text-white text-[8px] font-black uppercase px-3 py-1 rounded-full tracking-[0.3em] shadow-lg shadow-indigo-500/40">AI Statement Component</div>
                      <p className="text-gray-200 italic font-serif leading-relaxed text-xl opacity-95">"{e.reflection}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Education Record */}
            <section className="bg-gray-900/40 border border-gray-800/60 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="px-10 py-8 border-b border-gray-800/60 bg-gradient-to-r from-purple-500/5 to-transparent">
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em]">Academic Core Profile</h3>
              </div>
              <form onSubmit={handleEduSubmit} className="p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Institution</label>
                  <input required value={eduForm.school} onChange={e => setEduForm({...eduForm, school: e.target.value})} placeholder="Institution Name" className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-100 outline-none font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Level</label>
                  <input value={eduForm.qualification} onChange={e => setEduForm({...eduForm, qualification: e.target.value})} placeholder="e.g. IB DP / A-Levels" className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-100 outline-none font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Timeline</label>
                  <input value={eduForm.dates} onChange={e => setEduForm({...eduForm, dates: e.target.value})} placeholder="2022 - 2024" className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-100 outline-none font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Predicted/Final Scores</label>
                  <input value={eduForm.subjects} onChange={e => setEduForm({...eduForm, subjects: e.target.value})} placeholder="e.g. Math (A*), Physics (A*)" className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-100 outline-none font-bold" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Distinctions & Academic Awards</label>
                  <textarea value={eduForm.notes} onChange={e => setEduForm({...eduForm, notes: e.target.value})} placeholder="Scholarships, olympiads, or subject prizes..." className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-6 py-5 text-gray-300 outline-none min-h-[120px] resize-none leading-relaxed" />
                </div>
                <button type="submit" className="md:col-span-2 bg-gradient-to-br from-purple-600 to-indigo-700 py-6 rounded-2xl font-black text-white text-lg uppercase tracking-widest shadow-xl shadow-purple-900/20 active:scale-[0.99] transition-all">
                  Commit Record
                </button>
              </form>
            </section>

            {/* List */}
            <div className="space-y-10 pb-32">
              {eduEntries.map(e => (
                <div key={e.id} className="bg-gray-900/40 border border-gray-800/60 rounded-[2.5rem] p-12 hover:border-purple-500/40 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[80px] pointer-events-none group-hover:bg-purple-500/10 transition-all"></div>

                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="space-y-4">
                      <span className="px-5 py-2 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-purple-500/20">{e.qualification}</span>
                      <h4 className="text-3xl font-bold tracking-tight text-white">{e.school}</h4>
                      <p className="text-xs text-gray-500 font-mono font-bold tracking-widest uppercase">{e.dates}</p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => triggerEduInsight(e.id)} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${eduLoadingId === e.id ? 'bg-purple-600 text-white animate-pulse' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white'}`}
                      >
                        <ICONS.Sparkles /> {eduLoadingId === e.id ? 'Analyzing...' : 'Audit Profile'}
                      </button>
                      <button onClick={() => setEduEntries(eduEntries.filter(x => x.id !== e.id))} className="p-4 bg-gray-950/60 rounded-full text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all shadow-xl"><ICONS.Trash /></button>
                    </div>
                  </div>

                  <div className="space-y-10 relative z-10">
                    <div className="bg-gray-950/60 border border-gray-800 p-8 rounded-[2rem] shadow-inner">
                      <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Academic Output</h5>
                      <p className="text-cyan-400 font-mono text-2xl font-bold tracking-tighter">{e.subjects}</p>
                    </div>
                    {e.notes && (
                      <div className="pl-8 border-l-4 border-purple-500/20">
                        <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Academic Honors</h5>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">{e.notes}</p>
                      </div>
                    )}
                    {e.reflection && (
                      <div className="p-10 bg-purple-500/5 border border-purple-500/10 rounded-[2rem] animate-in slide-in-from-top-6">
                        <p className="text-gray-100 italic font-serif leading-relaxed text-xl opacity-95">"{e.reflection}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
