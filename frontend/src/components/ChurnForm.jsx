import { useState } from 'react';
import PropTypes from 'prop-types';
import { predictChurn } from '../api';
import { Loader2, Zap, Globe, User, Hash, Wallet, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const ChurnForm = ({ setResponse }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Geography: 'France',
        CreditScore: 600,
        Gender: 'Male',
        Age: 40,
        Tenure: 3,
        Balance: 60000,
        NumOfProducts: 2,
        HasCrCard: 1,
        IsActiveMember: 1,
        EstimatedSalary: 50000
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: isNaN(value) ? value : Number(value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await predictChurn(formData);
            setResponse(res.data);
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper component for styled inputs
    const InputField = ({ label, name, type = "number", icon: Icon }) => (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                {Icon && <Icon size={16} className="text-blue-500" />} {label}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all outline-none hover:border-slate-500"
                required
            />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-slate-800/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Geography Select */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                            <Globe size={16} className="text-blue-500" /> Geography
                        </label>
                        <select 
                            name="Geography" 
                            onChange={handleChange}
                            className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none appearance-none cursor-pointer"
                        >
                            <option value="France" className="bg-slate-900">France</option>
                            <option value="Germany" className="bg-slate-900">Germany</option>
                            <option value="Spain" className="bg-slate-900">Spain</option>
                        </select>
                    </div>

                    <InputField label="Credit Score" name="CreditScore" icon={Hash} />
                    <InputField label="Tenure (Years)" name="Tenure" icon={Briefcase} />
                    
                    {/* Gender Select */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                            <User size={16} className="text-blue-500" /> Gender
                        </label>
                        <select 
                            name="Gender" 
                            onChange={handleChange}
                            className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none appearance-none cursor-pointer"
                        >
                            <option value="Male" className="bg-slate-900">Male</option>
                            <option value="Female" className="bg-slate-900">Female</option>
                        </select>
                    </div>

                    <InputField label="Age" name="Age" icon={User} />
                    <InputField label="Balance ($)" name="Balance" icon={Wallet} />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                             Is Active Member?
                        </label>
                        <select 
                            name="IsActiveMember" 
                            onChange={handleChange}
                            className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none appearance-none cursor-pointer"
                        >
                            <option value={1} className="bg-slate-900">Yes</option>
                            <option value={0} className="bg-slate-900">No</option>
                        </select>
                    </div>
                     <InputField label="Number of Products" name="NumOfProducts" icon={Briefcase} />
                     <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                             Has Credit Card?
                        </label>
                        <select 
                            name="HasCrCard" 
                            onChange={handleChange}
                            className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none appearance-none cursor-pointer"
                        >
                            <option value={1} className="bg-slate-900">Yes</option>
                            <option value={0} className="bg-slate-900">No</option>
                        </select>
                    </div>
                    <InputField label="Estimated Salary" name="EstimatedSalary" icon={Briefcase} />
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2 overflow-hidden relative group"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            <Zap size={20} className="group-hover:animate-pulse" />
                            Run AI Prediction
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
};

ChurnForm.propTypes = {
    setResponse: PropTypes.func.isRequired
};

export default ChurnForm;
