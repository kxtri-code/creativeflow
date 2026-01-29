import React from 'react';
import { useToast } from '../../context/ToastContext';
import { FileText, Calendar, User } from 'lucide-react';

const articles = [
  { id: 1, title: 'The Future of AI in Design', stage: 'Drafting', author: 'Sarah J.', due: 'Tomorrow' },
  { id: 2, title: '10 Marketing Trends for 2026', stage: 'Review', author: 'Mike T.', due: 'Jan 31' },
  { id: 3, title: 'Client Case Study: Nike', stage: 'Editing', author: 'Sarah J.', due: 'Feb 2' },
  { id: 4, title: 'Internal Newsletter Feb', stage: 'Planned', author: 'Admin', due: 'Feb 5' },
  { id: 5, title: 'SEO Guide for Startups', stage: 'Published', author: 'Mike T.', due: 'Done' },
];

const EditorialPipeline = () => {
  const { addToast } = useToast();
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileText className="text-indigo-600" /> Editorial Pipeline
      </h2>

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <div className="space-y-3 pr-2">
          {articles.map((article) => (
            <div key={article.id} className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase
                  ${article.stage === 'Published' ? 'bg-emerald-100 text-emerald-600' :
                    article.stage === 'Review' ? 'bg-amber-100 text-amber-600' :
                    article.stage === 'Drafting' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-slate-100 text-slate-500'}
                `}>
                  {article.stage}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {article.due}</span>
                </div>
                <button onClick={() => addToast('Opening Editor', 'info')} className="text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Editor &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorialPipeline;
