import { useState } from 'react';
import ChurnForm from "./components/ChurnForm";
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [response, setResponse] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 font-sans text-slate-200">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center text-white mb-12 tracking-tight"
        >
          Bank Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI Predictor</span>
        </motion.h1>
        
        <div className="flex justify-center">
            <ChurnForm setResponse={setResponse} />
        </div>

        <AnimatePresence>
            {response && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-10 p-8 max-w-2xl mx-auto rounded-3xl shadow-2xl text-center border ${
                    response.churn_prediction === 'YES' 
                        ? 'bg-red-500/10 border-red-500/50 text-red-200 shadow-red-900/20' 
                        : 'bg-green-500/10 border-green-500/50 text-green-200 shadow-green-900/20'
                    }`}
                >
                    <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                        {response.churn_prediction === 'YES' ? '⚠️ High Risk' : '✅ Safe Customer'}
                    </h3>
                    
                    <div className="text-6xl font-black mb-4 tracking-tighter opacity-90">
                        {(response.probability * 100).toFixed(1)}%
                    </div>
                    
                    <p className="text-lg font-medium opacity-75 uppercase tracking-widest text-xs">
                        Churn Probability
                    </p>
                    
                    {response.message && (
                        <p className="mt-6 text-sm italic opacity-60 bg-black/20 py-2 px-4 rounded-full inline-block">
                            {response.message}
                        </p>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
