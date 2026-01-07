import React, { useState, useMemo } from 'react';
import { Transaction, BudgetLimit, EMI } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area, ComposedChart, Line, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { MONTHS_LIST } from '../constants';

interface FinanceViewProps {
  transactions: Transaction[];
  budgetLimits: BudgetLimit[];
  emis: EMI[];
  categories: {
    income: string[];
    expense: string[];
  };
  onUpdateCategories: (newCats: { income: string[]; expense: string[] }) => void;
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
  onUpdateBudget: (category: string, limit: number) => void;
  onAddEMI: (e: Omit<EMI, 'id'>) => void;
  onUpdateEMI: (id: string, updates: Partial<EMI>) => void;
  onDeleteEMI: (id: string) => void;
}

const REALISTIC_SUGGESTIONS = [
  "Client Retainer: Alpha",
  "Nvidia Equity Purchase",
  "Office Lease Payment",
  "SaaS Dividends",
  "Mutual Fund SIP",
  "Bitcoin Accumulation",
  "Credit Card Clearance",
  "Consulting Yield",
  "Rahul: Urgent Cash",
  "Gold ETF Buy"
];

const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6B6B'];

type FilterType = 'All' | 'Income' | 'Expense' | 'Investment' | 'Debt' | 'EMI';

export const FinanceView: React.FC<FinanceViewProps> = ({
  transactions,
  budgetLimits,
  emis,
  categories,
  onUpdateCategories,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onUpdateBudget,
  onAddEMI,
  onUpdateEMI,
  onDeleteEMI
}) => {
  // --- STATE ---
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<Exclude<Transaction['type'], 'subscription'> | 'emi'>('expense');
  const [category, setCategory] = useState(categories.expense[0] || '');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [historyFilter, setHistoryFilter] = useState<FilterType>('All');
  const [thresholdSearch, setThresholdSearch] = useState('');
  
  // EMI Form
  const [emiDuration, setEmiDuration] = useState('12');
  const [emiFrequency, setEmiFrequency] = useState<'monthly' | 'weekly'>('monthly');

  // View Settings
  const [viewType, setViewType] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(MONTHS_LIST[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [showCatManager, setShowCatManager] = useState(false);

  // UX State
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);

  // --- STATISTICS ENGINE ---
  const stats = useMemo(() => {
    // 1. Time Filtering
    const temporalFiltered = transactions.filter(t => {
      const d = new Date(t.date);
      const mMatch = viewType === 'Yearly' || MONTHS_LIST[d.getMonth()] === selectedMonth;
      const yMatch = d.getFullYear().toString() === selectedYear;
      return mMatch && yMatch;
    });

    // 2. Global Totals
    const income = temporalFiltered.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = temporalFiltered.filter(t => t.type === 'expense' || t.type === 'emi_payment').reduce((acc, t) => acc + t.amount, 0);
    const borrow = temporalFiltered.filter(t => t.type === 'borrow' && t.status !== 'settled').reduce((acc, t) => acc + t.amount, 0);
    const lend = temporalFiltered.filter(t => t.type === 'lend' && t.status !== 'settled').reduce((acc, t) => acc + t.amount, 0);
    const investments = temporalFiltered.filter(t => t.type === 'investment').reduce((acc, t) => acc + t.amount, 0);
    
    const delta = (income + borrow) - (expense + lend + investments);
    const savingsRate = (income > 0) ? Math.round(((income - expense) / income) * 100) : 0;

    // 3. Trend Data
    let trendData: any[] = [];
    if (viewType === 'Yearly') {
      let cumulativeBalance = 0;
      trendData = MONTHS_LIST.map((m, idx) => {
        const monthTrans = transactions.filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === idx && d.getFullYear().toString() === selectedYear;
        });
        const mInc = monthTrans.filter(t => t.type === 'income' || (t.type === 'borrow' && t.status !== 'settled')).reduce((acc, t) => acc + t.amount, 0);
        const mExp = monthTrans.filter(t => t.type === 'expense' || t.type === 'emi_payment' || (t.type === 'lend' && t.status !== 'settled')).reduce((acc, t) => acc + t.amount, 0);
        cumulativeBalance += (mInc - mExp);
        return { label: m.slice(0, 3), income: mInc, expense: mExp, balance: cumulativeBalance };
      });
    } else {
      const daysInMonth = new Date(parseInt(selectedYear), MONTHS_LIST.indexOf(selectedMonth) + 1, 0).getDate();
      trendData = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNum = i + 1;
        const dayTrans = temporalFiltered.filter(t => new Date(t.date).getDate() === dayNum);
        return { 
          label: dayNum.toString(), 
          income: dayTrans.filter(t => t.type === 'income' || (t.type === 'borrow' && t.status !== 'settled')).reduce((acc, t) => acc + t.amount, 0), 
          expense: dayTrans.filter(t => t.type === 'expense' || t.type === 'emi_payment' || (t.type === 'lend' && t.status !== 'settled')).reduce((acc, t) => acc + t.amount, 0) 
        };
      });
    }

    // 4. Advanced Entity Aggregation (Credit/Debt) - CASE INSENSITIVE
    const entityMap: Record<string, { 
      name: string, 
      borrowed: number, 
      lent: number, 
      net: number, 
      history: Transaction[] 
    }> = {};

    const debtTransactions = transactions.filter(t => (t.type === 'borrow' || t.type === 'lend'));
    
    debtTransactions.forEach(t => {
      let rawName = t.desc.includes(':') ? t.desc.split(':')[0] : t.desc;
      rawName = rawName.trim();
      
      // Normalize to lowercase for grouping
      const entityKey = rawName.toLowerCase();
      
      if (!entityMap[entityKey]) {
        // Use the first found rawName for display
        entityMap[entityKey] = { name: rawName, borrowed: 0, lent: 0, net: 0, history: [] };
      }
      
      entityMap[entityKey].history.push(t);

      if (t.status !== 'settled') {
        if (t.type === 'borrow') entityMap[entityKey].borrowed += t.amount;
        if (t.type === 'lend') entityMap[entityKey].lent += t.amount;
      }
    });

    Object.values(entityMap).forEach(e => {
      e.net = e.lent - e.borrowed;
      e.history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    const entities = Object.values(entityMap)
      .sort((a, b) => {
         const aActive = a.net !== 0;
         const bActive = b.net !== 0;
         if (aActive && !bActive) return -1;
         if (!aActive && bActive) return 1;
         return Math.abs(b.net) - Math.abs(a.net);
      });

    const totalReceivable = entities.reduce((acc, e) => acc + (e.net > 0 ? e.net : 0), 0);
    const totalPayable = entities.reduce((acc, e) => acc + (e.net < 0 ? Math.abs(e.net) : 0), 0);

    // 5. Investment Analytics
    const investmentBreakdown: Record<string, number> = {};
    temporalFiltered.filter(t => t.type === 'investment').forEach(t => {
        const key = t.desc.trim();
        investmentBreakdown[key] = (investmentBreakdown[key] || 0) + t.amount;
    });
    
    const investmentChartData = Object.entries(investmentBreakdown)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // 6. Historical Ledger Filter Logic
    const ledgerData = temporalFiltered.filter(t => {
       const matchesSearch = t.desc.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             t.category.toLowerCase().includes(searchQuery.toLowerCase());
       
       if (!matchesSearch) return false;

       if (historyFilter === 'All') return true;
       if (historyFilter === 'Income') return t.type === 'income';
       if (historyFilter === 'Expense') return t.type === 'expense';
       if (historyFilter === 'Investment') return t.type === 'investment';
       if (historyFilter === 'Debt') return t.type === 'borrow' || t.type === 'lend';
       if (historyFilter === 'EMI') return t.type === 'emi_payment';
       return true;
    });

    return { 
      income, expense, borrow, lend, investments, delta, savingsRate, trendData, 
      filtered: ledgerData, rawTemporal: temporalFiltered, 
      entities, totalReceivable, totalPayable,
      investmentChartData,
      totalPortfolio: investments
    };
  }, [transactions, selectedMonth, selectedYear, viewType, categories, searchQuery, historyFilter]);

  // --- HANDLERS ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    const now = new Date();
    const fullDate = new Date(
      parseInt(selectedYear), 
      MONTHS_LIST.indexOf(selectedMonth), 
      now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()
    );
    
    if (type === 'emi') {
      onAddEMI({
        desc,
        amount: parseFloat(amount),
        totalInstallments: parseInt(emiDuration) || 1,
        paidInstallments: 0,
        frequency: emiFrequency,
        startDate: fullDate.toISOString()
      });
      setDesc(''); setAmount('');
      return;
    }

    let targetCat = category;
    if (type === 'borrow' || type === 'lend') targetCat = 'Credit/Debt';
    if (type === 'investment') targetCat = 'Portfolio Growth';

    onAddTransaction({
      date: fullDate.toISOString(),
      desc, amount: parseFloat(amount), 
      type: type as Transaction['type'], 
      category: targetCat,
      status: 'pending'
    });
    setDesc(''); setAmount('');
  };

  const handlePayEMI = (emi: EMI) => {
    if (emi.paidInstallments >= emi.totalInstallments) return;
    const installmentDesc = `EMI: ${emi.desc} (${emi.paidInstallments + 1}/${emi.totalInstallments})`;
    onAddTransaction({
      date: new Date().toISOString(),
      desc: installmentDesc,
      amount: emi.amount,
      type: 'emi_payment',
      category: 'Debt Repayment',
      status: 'settled',
      settledAt: new Date().toISOString()
    });
    onUpdateEMI(emi.id, { paidInstallments: emi.paidInstallments + 1 });
  };

  const handleRevertEMI = (e: React.MouseEvent, emi: EMI) => {
    e.preventDefault(); e.stopPropagation(); 
    if (emi.paidInstallments <= 0) return;

    const previousInstallmentNum = emi.paidInstallments;
    const targetLabel = `EMI: ${emi.desc} (${previousInstallmentNum}/${emi.totalInstallments})`.toLowerCase().trim();

    const transactionToDelete = [...transactions].reverse().find(t => 
      t.type === 'emi_payment' && t.desc.toLowerCase().trim() === targetLabel
    );

    if (transactionToDelete) {
        onDeleteTransaction(transactionToDelete.id);
    }
    onUpdateEMI(emi.id, { paidInstallments: previousInstallmentNum - 1 });
  };

  const handleToggleSettled = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    const t = transactions.find(x => x.id === id);
    if (!t || t.status === 'settled') return; 
    onUpdateTransaction(id, { status: 'settled', settledAt: new Date().toISOString() });
  };

  const typeStyles: Record<string, string> = {
    income: 'bg-[#76C7C0] shadow-emerald-200',
    expense: 'bg-[#111827] shadow-slate-300',
    borrow: 'bg-amber-500 shadow-amber-200',
    lend: 'bg-indigo-600 shadow-indigo-200',
    investment: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-200',
    emi: 'bg-orange-600 shadow-orange-200'
  };

  return (
    <div className="max-w-[1200px] mx-auto px-3 py-2 space-y-6 animate-in fade-in duration-500 pb-32">
      
      {/* 1. CONTROL HUB */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col gap-1.5">
           <h2 className="text-sm font-black italic uppercase text-slate-900 tracking-tighter">Wealth.Arch</h2>
           <div className="flex gap-1.5">
              <button onClick={() => setViewType('Monthly')} className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${viewType === 'Monthly' ? 'bg-[#111827] text-white' : 'bg-slate-50 text-slate-400'}`}>Daily</button>
              <button onClick={() => setViewType('Yearly')} className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${viewType === 'Yearly' ? 'bg-[#111827] text-white' : 'bg-slate-50 text-slate-400'}`}>Yearly</button>
              <button onClick={() => setShowCatManager(!showCatManager)} className="px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-500 border border-indigo-100">Zones</button>
           </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
           {viewType === 'Monthly' && (
             <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="flex-1 md:w-28 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase outline-none appearance-none cursor-pointer">
                {MONTHS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
             </select>
           )}
           <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="flex-1 md:w-20 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase outline-none appearance-none cursor-pointer">
              {['2024', '2025', '2026', '2027'].map(y => <option key={y} value={y}>{y}</option>)}
           </select>
        </div>
      </section>

      {/* 2. TELEMETRY */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#111827] p-4 rounded-xl border border-white/5 shadow-md group">
          <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1 italic opacity-80">Net Liquidity</p>
          <div className="flex items-baseline gap-2">
             <p className="text-2xl font-black text-white italic tracking-tighter">₹{stats.delta.toLocaleString()}</p>
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-tight">{stats.savingsRate}% Yield</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5 italic">Capital Inflow</p>
          <p className="text-xl font-black text-slate-900 italic tracking-tighter">₹{(stats.income + stats.borrow).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[8px] font-black text-rose-300 uppercase tracking-widest mb-0.5 italic">Operating Burn</p>
          <p className="text-xl font-black text-slate-900 italic tracking-tighter">₹{(stats.expense + stats.lend).toLocaleString()}</p>
        </div>
        <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-violet-200/50 rounded-bl-full blur-xl" />
          <p className="text-[8px] font-black text-violet-400 uppercase tracking-widest mb-0.5 italic">Asset Allocation</p>
          <p className="text-xl font-black text-violet-900 italic tracking-tighter">₹{(stats.investments).toLocaleString()}</p>
        </div>
      </section>

      {/* 3. DEPLOYMENT HUB (ENTRY FORM) */}
      <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase text-slate-500 italic tracking-[0.1em]">Deployment Hub</h3>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Initialize Node • {selectedMonth}</p>
             </div>
             <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                {(['income', 'expense', 'borrow', 'lend', 'investment', 'emi'] as const).map(t => (
                   <button 
                     key={t}
                     onClick={() => { setType(t); if (t !== 'borrow' && t !== 'lend' && t !== 'investment' && t !== 'emi') setCategory(categories[t === 'income' ? 'income' : 'expense'][0]); }} 
                     className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {t.slice(0,3)}
                   </button>
                ))}
             </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
             <div className="md:col-span-1">
                <input list="fin-sug" placeholder="Label Node (e.g., Rahul: Lunch)" value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-slate-400 transition-all shadow-sm" />
                <datalist id="fin-sug">{REALISTIC_SUGGESTIONS.map(s => <option key={s} value={s} />)}</datalist>
             </div>
             <div className="flex flex-col gap-1">
                <input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} className="bg-white border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-black outline-none focus:border-slate-400 transition-all shadow-sm" />
                {type === 'emi' && <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Per Installment</span>}
             </div>
             {type === 'emi' ? (
                <div className="grid grid-cols-2 gap-2">
                   <div className="flex flex-col gap-1">
                      <input type="number" placeholder="Duration" value={emiDuration} onChange={(e) => setEmiDuration(e.target.value)} className="bg-white border border-slate-100 rounded-xl px-3 py-3 text-[10px] font-black outline-none shadow-sm" />
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Total {emiFrequency === 'monthly' ? 'Months' : 'Weeks'}</span>
                   </div>
                   <select value={emiFrequency} onChange={(e) => setEmiFrequency(e.target.value as any)} className="bg-white border border-slate-100 rounded-xl px-2 py-3 text-[9px] font-black uppercase shadow-sm outline-none">
                     <option value="monthly">Monthly</option>
                     <option value="weekly">Weekly</option>
                   </select>
                </div>
             ) : (
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  disabled={['borrow', 'lend', 'investment'].includes(type)}
                  className="bg-white border border-slate-100 rounded-xl px-3 py-3 text-[9px] font-black uppercase outline-none disabled:bg-slate-50 disabled:text-slate-400 shadow-sm"
                >
                  {type === 'borrow' || type === 'lend' ? <option>Credit/Debt</option> :
                   type === 'investment' ? <option>Portfolio Growth</option> :
                   categories[type === 'income' ? 'income' : 'expense'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             )}
             <button type="submit" className={`rounded-xl text-[10px] font-black uppercase tracking-[0.2em] py-3 shadow-lg transition-all active:scale-[0.98] text-white ${typeStyles[type as keyof typeof typeStyles]}`}>
               Deploy {type}
             </button>
          </form>
      </section>

      {/* 4. NETWORK LIQUIDITY MATRIX (CREDIT/DEBT) */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {/* Header with High-Level Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-50 pb-6">
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 italic tracking-[0.3em] mb-1">Network Liquidity</h3>
            <p className="text-[8px] font-bold text-slate-300 uppercase">Active credit lines & obligations</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="flex-1 md:w-48 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Receivable (In)</p>
                <p className="text-xl font-black text-emerald-700 italic tracking-tighter">₹{stats.totalReceivable.toLocaleString()}</p>
             </div>
             <div className="flex-1 md:w-48 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <p className="text-[8px] font-black text-amber-400 uppercase tracking-widest mb-1">Payable (Out)</p>
                <p className="text-xl font-black text-amber-700 italic tracking-tighter">₹{stats.totalPayable.toLocaleString()}</p>
             </div>
          </div>
        </div>

        {/* Entity Grid - SHOWS ALL, even settled */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.entities.map(entity => {
            const isSettled = entity.net === 0;
            const isPositive = entity.net > 0;
            const isExpanded = expandedEntity === entity.name;

            // Styles based on state
            let boxClass = 'bg-white hover:bg-slate-50 border-slate-100';
            let iconClass = isSettled ? 'bg-slate-100 text-slate-400' : (isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600');
            let textClass = isSettled ? 'text-slate-400' : (isPositive ? 'text-emerald-500' : 'text-amber-500');
            let amountClass = isSettled ? 'text-slate-300 decoration-slate-200' : (isPositive ? 'text-emerald-600' : 'text-amber-600');

            if (isExpanded) {
              boxClass = 'bg-white ring-2 ring-indigo-100 shadow-md col-span-1 md:col-span-2 lg:col-span-3';
            }

            return (
              <div 
                key={entity.name} 
                onClick={() => setExpandedEntity(isExpanded ? null : entity.name)}
                className={`border rounded-2xl transition-all cursor-pointer overflow-hidden ${boxClass}`}
              >
                {/* Entity Summary Card */}
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${iconClass}`}>
                      {entity.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                       <h4 className={`text-[11px] font-black uppercase tracking-tight ${isSettled ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{entity.name}</h4>
                       <p className={`text-[9px] font-bold uppercase ${textClass}`}>
                         {isSettled ? 'Fully Settled' : (isPositive ? 'Owes You' : 'You Owe')}
                       </p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className={`text-xl font-black italic tracking-tighter ${amountClass}`}>
                       ₹{Math.abs(entity.net).toLocaleString()}
                     </p>
                     <p className="text-[8px] font-bold text-slate-300 uppercase">{entity.history.length} Records</p>
                  </div>
                </div>

                {/* Expanded Transaction History */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Complete Ledger: {entity.name}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       {entity.history.map(t => (
                         <div key={t.id} className={`flex justify-between items-center p-3 rounded-lg border ${t.status === 'settled' ? 'bg-white opacity-60 border-slate-100 grayscale' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => handleToggleSettled(t.id, e)}
                                disabled={t.status === 'settled'}
                                className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${t.status === 'settled' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 hover:border-emerald-400 text-transparent hover:text-emerald-300'}`}
                              >
                                ✓
                              </button>
                              <div className="flex flex-col">
                                <span className={`text-[9px] font-bold uppercase ${t.type === 'borrow' ? 'text-amber-600' : 'text-indigo-600'} ${t.status === 'settled' ? 'line-through' : ''}`}>
                                   {t.type === 'borrow' ? 'Borrowed' : 'Lent'}
                                </span>
                                <span className="text-[8px] text-slate-400 italic">{new Date(t.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <span className={`text-[11px] font-black ${t.status === 'settled' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>₹{t.amount.toLocaleString()}</span>
                               <button onClick={(e) => { e.stopPropagation(); onDeleteTransaction(t.id); }} className="text-slate-300 hover:text-rose-500 px-2">×</button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {stats.entities.length === 0 && (
             <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-50 rounded-2xl">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Debt History Found</p>
             </div>
          )}
        </div>
      </section>

      {/* 5. EMI & THRESHOLDS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* EMI TRACKING BOARD */}
          <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-3">
                <h3 className="text-[10px] font-black uppercase text-slate-500 italic tracking-widest">EMI Matrix</h3>
            </div>
            <div className="space-y-3">
                {emis.map(emi => {
                  const progress = Math.round((emi.paidInstallments / emi.totalInstallments) * 100);
                  const isComplete = emi.paidInstallments >= emi.totalInstallments;
                  return (
                      <div key={emi.id} className="p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-all bg-white">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase text-slate-800">{emi.desc}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400">{emi.paidInstallments}/{emi.totalInstallments}</span>
                                <button onClick={() => onDeleteEMI(emi.id)} className="text-slate-200 hover:text-rose-500 text-[10px]">×</button>
                            </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] font-black italic">₹{emi.amount.toLocaleString()}</span>
                            <div className="flex gap-2">
                                {/* UNDO BUTTON */}
                                {emi.paidInstallments > 0 && (
                                    <button 
                                        onClick={(e) => handleRevertEMI(e, emi)}
                                        className="w-7 h-7 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                                        title="Undo Last Payment"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5"></path></svg>
                                    </button>
                                )}
                                {/* PAY BUTTON */}
                                <button 
                                    onClick={() => handlePayEMI(emi)} 
                                    disabled={isComplete}
                                    className={`px-3 py-1 text-[8px] font-black uppercase rounded-lg transition-all ${isComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                                >
                                    {isComplete ? 'Done' : 'Pay'}
                                </button>
                            </div>
                        </div>
                      </div>
                  );
                })}
                {emis.length === 0 && <p className="text-center py-8 text-[9px] text-slate-300 font-bold uppercase">No active liabilities</p>}
            </div>
          </section>

          {/* SECTOR THRESHOLDS - UPDATED INPUT WIDTH */}
          <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <h3 className="text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Budget Zones</h3>
                <input type="text" placeholder="Search..." value={thresholdSearch} onChange={(e) => setThresholdSearch(e.target.value)} className="bg-slate-50 rounded-full px-3 py-1 text-[8px] font-black uppercase outline-none w-24" />
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] no-scrollbar pr-1">
                {categories.expense.filter(c => c.toLowerCase().includes(thresholdSearch.toLowerCase())).map(cat => {
                  const limit = budgetLimits.find(l => l.category === cat)?.limit || 0;
                  const spent = stats.rawTemporal.filter(t => t.type === 'expense' && t.category === cat).reduce((acc, t) => acc + t.amount, 0);
                  const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                  return (
                      <div key={cat} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-slate-700 uppercase truncate max-w-[80px]">{cat}</span>
                            <input 
                                type="number" 
                                value={limit || ''} 
                                onChange={(e) => onUpdateBudget(cat, parseFloat(e.target.value) || 0)} 
                                className="w-20 text-right bg-transparent text-[9px] font-bold outline-none placeholder-slate-300" 
                                placeholder="Set" 
                            />
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full mb-1">
                            <div className={`h-full rounded-full ${percent > 100 ? 'bg-rose-500' : 'bg-[#76C7C0]'}`} style={{ width: `${Math.min(100, percent)}%` }} />
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 text-right">{percent}%</p>
                      </div>
                  );
                })}
            </div>
          </section>
      </div>

      {/* 6. PERFORMANCE CHART */}
      <section className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
         <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               {viewType === 'Yearly' ? (
                 <ComposedChart data={stats.trendData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 8, fontWeight: 800, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '9px', fontWeight: '900' }} />
                    <Bar dataKey="income" fill="#76C7C0" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar dataKey="expense" fill="#F43F5E" radius={[2, 2, 0, 0]} barSize={12} />
                    <Line type="monotone" dataKey="balance" stroke="#4F46E5" strokeWidth={2} dot={false} />
                 </ComposedChart>
               ) : (
                 <AreaChart data={stats.trendData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 800, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '9px', fontWeight: '900' }} />
                    <Area type="monotone" dataKey="income" stroke="#76C7C0" fill="#76C7C0" fillOpacity={0.08} strokeWidth={2} />
                    <Area type="monotone" dataKey="expense" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.08} strokeWidth={2} />
                 </AreaChart>
               )}
            </ResponsiveContainer>
         </div>
      </section>

      {/* 7. PORTFOLIO COMMAND CENTER */}
      <section className="bg-gradient-to-br from-[#1a1c2c] to-[#0f1016] p-6 md:p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-violet-600/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col h-full justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                        <h3 className="text-[10px] font-black uppercase text-violet-300 italic tracking-[0.4em]">Portfolio Command Center</h3>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl md:text-6xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            ₹{stats.totalPortfolio.toLocaleString()}
                        </span>
                    </div>
                    <p className="text-[9px] font-black uppercase text-slate-500 mt-2 tracking-widest">Total Capital Deployed • {selectedMonth}</p>
                </div>
                <div className="space-y-3">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2">Top Holdings</p>
                    <div className="space-y-2">
                        {stats.investmentChartData.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center group/asset cursor-default">
                                <div className="flex items-center gap-2">
                                    <div className="text-[9px] font-black text-white/40 group-hover/asset:text-violet-400 transition-colors">0{idx + 1}</div>
                                    <div className="text-[10px] font-bold text-slate-200 uppercase">{item.name}</div>
                                </div>
                                <div className="text-[10px] font-black text-white">₹{item.value.toLocaleString()}</div>
                            </div>
                        ))}
                         {stats.investmentChartData.length === 0 && <span className="text-[9px] text-slate-600 italic">No assets allocated</span>}
                    </div>
                </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-sm flex flex-col items-center">
                {stats.investmentChartData.length > 0 ? (
                    <div className="w-full h-[220px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={stats.investmentChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                    {stats.investmentChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f1016', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: 'bold', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.7 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                             <span className="text-[8px] font-black text-slate-500 uppercase block">Assets</span>
                             <span className="text-[14px] font-black text-white">{stats.investmentChartData.length}</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-[220px] flex items-center justify-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Awaiting Data</p>
                    </div>
                )}
            </div>
         </div>
      </section>

      {/* 8. STRATEGY LEDGER HISTORY (WITH FILTERS) */}
      <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50 pb-4 gap-4">
              <div className="flex flex-col">
                 <h3 className="text-[10px] font-black uppercase text-slate-500 italic tracking-widest">Historical Ledger</h3>
                 <p className="text-[8px] text-slate-300 font-bold uppercase">{stats.filtered.length} nodes archived • {selectedMonth}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                 {/* Filter Pills */}
                 <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100 overflow-x-auto no-scrollbar">
                    {(['All', 'Income', 'Expense', 'Investment', 'Debt', 'EMI'] as FilterType[]).map(f => (
                       <button
                         key={f}
                         onClick={() => setHistoryFilter(f)}
                         className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${historyFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                         {f}
                       </button>
                    ))}
                 </div>

                 {/* Search Box */}
                 <div className="relative flex-1">
                   <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                   <input 
                     type="text" 
                     placeholder="Search node..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-8 pr-4 py-2 text-[10px] font-bold outline-none focus:border-indigo-400 transition-all shadow-inner"
                   />
                 </div>
              </div>
           </div>

           <div className="max-h-[500px] overflow-y-auto no-scrollbar space-y-2 pr-1">
              {[...stats.filtered].reverse().map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50/40 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 transition-all group/item shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shadow-inner 
                       ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 
                         t.type === 'expense' ? 'bg-rose-100 text-rose-600' : 
                         t.type === 'borrow' ? 'bg-amber-100 text-amber-600' : 
                         t.type === 'lend' ? 'bg-indigo-100 text-indigo-600' : 
                         t.type === 'investment' ? 'bg-violet-100 text-violet-600' : 
                         t.type === 'emi_payment' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                       {t.type === 'income' ? '↑' : t.type === 'expense' ? '↓' : t.type === 'borrow' ? '🤝' : t.type === 'lend' ? '💸' : t.type === 'investment' ? '📈' : '🗓️'}
                     </div>
                     <div className="flex flex-col overflow-hidden">
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter truncate max-w-[180px]">{t.desc}</p>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                          {t.type} • {t.category} • {new Date(t.date).toLocaleString('en-GB', {day:'2-digit', month:'short', hour: '2-digit', minute: '2-digit'})}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`text-[12px] font-black italic tracking-tighter 
                       ${(t.type === 'income' || t.type === 'borrow' || t.type === 'investment') ? 'text-emerald-600' : 'text-slate-900'}`}>
                       ₹{t.amount.toLocaleString()}
                     </span>
                     <button onClick={() => onDeleteTransaction(t.id)} className="text-[10px] text-slate-300 hover:text-rose-500 p-2 opacity-0 group-hover/item:opacity-100 transition-opacity">×</button>
                  </div>
                </div>
              ))}
              {stats.filtered.length === 0 && <p className="text-center py-16 text-[9px] font-black text-slate-200 uppercase tracking-[0.2em]">Historical ledger is currently empty</p>}
           </div>
      </section>
    </div>
  );
};