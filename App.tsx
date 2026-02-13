import React, { useState, useEffect } from 'react';
import { CVEntry, EducationEntry, Category } from './types';
import { CATEGORIES, ADMISSION_REMINDERS, ICONS } from './constants';
import { generateReflectiveParagraph, generateEducationInsight } from './services/geminiService';

type Tab = 'experiences' | 'education';

const App: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row text-gray-200 font-sans selection:bg-cyan-500/30">
      
      {/* Sidebar */}
      <aside className="w-full md:w-[22rem] bg-gray-900/40 backdrop-blur-xl border-r border-gray-800/60 p-8 flex flex-col gap-8 sticky top-0 h-auto md:h-screen overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight mb-2">CV Vault.</h1>
          <p className="text-gray-500 text-sm font-medium italic">Architecting Academic Success</p>
        </div>

        <section className="flex-1">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-gray-700"></span>
            Admissions Strategy
          </h2>
          <div className="space-y-4">
            {ADMISSION_REMINDERS.map(reminder => (
              <div key={reminder.id} className="p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full ring-2 ring-offset-2 ring-offset-gray-900 ${
                    reminder.priority === 'High' ? 'bg-rose-500 ring-rose-500/30' : 
                    reminder.priority === 'Medium' ? 'bg-amber-500 ring-amber-500/30' : 'bg-emerald-500 ring-emerald-500/30'
                  }`} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{reminder.priority}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{reminder.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t border-gray-800/60 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl transition-all text-sm font-semibold border border-gray-700/50">
            Backup Data
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:p-12 space-y-8">
        
        {/* Tab Switcher */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-900/60 p-1.5 rounded-2xl inline-flex border border-gray-800/60">
            <button onClick={() => setActiveTab('experiences')}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'experiences' ? 'bg-gray-800 text-cyan-400 shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}>
              Super-Curriculars
            </button>
            <button onClick={() => setActiveTab('education')}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'education' ? 'bg-gray-800 text-purple-400 shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}>
              Education
            </button>
          </div>
        </div>

        {activeTab === 'experiences' ? (
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="bg-gray-900/40 border border-gray-800/60 rounded-3xl overflow-hidden shadow-2xl">
              <form onSubmit={handleExpSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Activity Title</label>
                  <input placeholder="e.g. Advanced Calculus Research" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-cyan-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value as Category})} className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none appearance-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">The Challenge</label>
                  <textarea placeholder="What was difficult?" required value={form.challenge} onChange={e => setForm({...form, challenge: e.target.value})} className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none min-h-[100px]" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">The Learning</label>
                  <textarea placeholder="What did you gain?" required value={form.learning} onChange={e => setForm({...form, learning: e.target.value})} className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none min-h-[100px]" />
                </div>
                <button type="submit" className="md:col-span-2 bg-gradient-to-r from-cyan-600 to-blue-600 py-4 rounded-xl font-bold shadow-lg shadow-cyan-900/20 hover:scale-[1.01] transition-transform">Log Activity</button>
              </form>
            </section>

            <div className="space-y-8 pb-20">
              {entries.map(e => (
                <div key={e.id} className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8 hover:border-gray-700 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-cyan-500/10 mr-3">{e.category}</span>
                      <h4 className="text-2xl font-bold mt-4">{e.title}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => triggerReflection(e.id)} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20">
                        <ICONS.Sparkles /> {loadingId === e.id ? 'Refining...' : 'Reflect'}
                      </button>
                      <button onClick={() => setEntries(entries.filter(x => x.id !== e.id))} className="p-2 text-gray-500 hover:text-rose-400 transition-colors"><ICONS.Trash /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div><h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Challenge</h5><p className="text-gray-300 text-sm leading-relaxed">{e.challenge}</p></div>
                    <div><h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Learning</h5><p className="text-gray-300 text-sm leading-relaxed">{e.learning}</p></div>
                  </div>
                  {e.reflection && (
                    <div className="mt-8 p-6 bg-indigo-900/10 border border-indigo-500/10 rounded-2xl">
                      <p className="text-gray-200 italic font-serif opacity-90 leading-relaxed text-lg">"{e.reflection}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="bg-gray-900/40 border border-gray-800/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-purple-500/10 px-8 py-4 border-b border-gray-800/60">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">Enrollment Log</h3>
              </div>
              <form onSubmit={handleEduSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Institution</label>
                  <input required value={eduForm.school} onChange={e => setEduForm({...eduForm, school: e.target.value})} placeholder="e.g. St. Jude's College" className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Qualification</label>
                  <input value={eduForm.qualification} onChange={e => setEduForm({...eduForm, qualification: e.target.value})} placeholder="e.g. A-Levels / IB DP" className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Dates</label>
                  <input value={eduForm.dates} onChange={e => setEduForm({...eduForm, dates: e.target.value})} placeholder="Sept 2022 - June 2024" className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Grades / Subjects</label>
                  <input value={eduForm.subjects} onChange={e => setEduForm({...eduForm, subjects: e.target.value})} placeholder="Math (A*), Econ (A), CS (A*)" className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Awards & Notes</label>
                  <textarea value={eduForm.notes} onChange={e => setEduForm({...eduForm, notes: e.target.value})} placeholder="Research prizes, academic positions..." className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none min-h-[80px]" />
                </div>
                <button type="submit" className="md:col-span-2 bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl font-bold shadow-lg shadow-purple-900/20 hover:scale-[1.01] transition-transform">Add Record</button>
              </form>
            </section>

            <div className="space-y-8 pb-20">
              {eduEntries.map(e => (
                <div key={e.id} className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8 hover:border-purple-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-purple-500/10">{e.qualification}</span>
                      <h4 className="text-2xl font-bold mt-4">{e.school}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => triggerEduInsight(e.id)} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20">
                        <ICONS.Sparkles /> {eduLoadingId === e.id ? 'Analyzing...' : 'AI Insight'}
                      </button>
                      <button onClick={() => setEduEntries(eduEntries.filter(x => x.id !== e.id))} className="p-2 text-gray-500 hover:text-rose-400 transition-colors"><ICONS.Trash /></button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gray-950/80 border border-gray-800 p-4 rounded-xl">
                      <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Academic Transcript</h5>
                      <p className="text-cyan-400 font-mono text-lg">{e.subjects}</p>
                    </div>
                    {e.notes && (
                      <div className="pl-4 border-l-2 border-purple-500/30">
                        <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Honours</h5>
                        <p className="text-gray-400 text-sm">{e.notes}</p>
                      </div>
                    )}
                    {e.reflection && (
                      <div className="p-6 bg-purple-900/10 border border-purple-500/10 rounded-2xl">
                        <p className="text-gray-100 italic font-serif opacity-90 leading-relaxed text-lg">"{e.reflection}"</p>
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