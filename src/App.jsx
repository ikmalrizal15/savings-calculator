import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function App() {
  const [form, setForm] = useState({
    targetSavings: '',
    durationMonths: '',
    monthlyIncome: '',
  });

  const [result, setResult] = useState(null);
  const [isDark, setIsDark] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateScenarios = () => {
    const target = parseFloat(form.targetSavings);
    const duration = parseInt(form.durationMonths);
    const income = parseFloat(form.monthlyIncome);

    if (isNaN(target) || isNaN(duration) || isNaN(income)) {
      alert('Please fill all fields correctly.');
      return;
    }

    const percentages = [80, 50, 30, 20, 10];
    const scenarios = percentages.map((percent) => {
      const monthlySavings = (income * percent) / 100;
      const totalSavings = monthlySavings * duration;
      const percentageOfTarget = ((totalSavings / target) * 100).toFixed(1);

      const monthlyBudget = income - monthlySavings;
      const weeklyBudget = monthlyBudget / 4;
      const dailyBudget = monthlyBudget / 30;

      return {
        percent,
        monthlySavings: monthlySavings.toFixed(2),
        totalSavings: totalSavings.toFixed(2),
        percentageOfTarget,
        monthlyBudget: monthlyBudget.toFixed(2),
        weeklyBudget: weeklyBudget.toFixed(2),
        dailyBudget: dailyBudget.toFixed(2),
        reachesTarget: totalSavings >= target,
      };
    });

    setResult({ scenarios });
  };

  const toggleDarkMode = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-gray-900' : 'bg-gradient-to-tr from-white via-gray-100 to-gray-300'} flex flex-col items-center p-6 transition-colors duration-500 relative`}>
      
      {/* Dark Mode Toggle */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg text-white text-xl"
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </motion.button>

      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>💰 Savings Calculator</h1>

      {/* Input Section */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Target Amount (RM)', name: 'targetSavings' },
          { label: 'Duration (months)', name: 'durationMonths' },
          { label: 'Monthly Income (RM)', name: 'monthlyIncome' },
        ].map((input, idx) => (
          <div key={idx}>
            <label className={`block mb-2 text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{input.label}</label>
            <input
              type="number"
              name={input.name}
              value={form[input.name]}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={calculateScenarios}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
      >
        Calculate
      </button>

      {/* Results */}
      {result && (
        <div className="w-full max-w-5xl mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.scenarios.map((s, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl shadow-2xl p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            >
              <h2 className="text-xl font-bold mb-2">{s.percent}% Savings</h2>
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${s.reachesTarget ? 'bg-green-500' : 'bg-red-500'}`}>
                {s.reachesTarget ? 'Reaches Target' : 'Below Target'}
              </div>
              <div className="mt-6 space-y-2">
                <p><span className="text-purple-400 font-semibold">Monthly Savings:</span> RM {s.monthlySavings}</p>
                <p><span className="text-purple-400 font-semibold">Total After {form.durationMonths} months:</span> RM {s.totalSavings}</p>
                <p><span className="text-purple-400 font-semibold">{s.percentageOfTarget}% of target</span></p>
              </div>

              {/* Progress Bar (capped at 100% width) */}
              <div className="mt-4 w-full bg-gray-700 rounded-full h-3 overflow-hidden relative">
                <div
                  className={`h-full absolute left-0 top-0 rounded-full ${s.reachesTarget ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(s.percentageOfTarget, 100)}%`, transition: 'width 0.5s' }}
                ></div>
              </div>

              <div className="mt-4 border-t border-gray-600 pt-4 space-y-1 text-sm">
                <p>Monthly Budget: <span className="font-bold">RM {s.monthlyBudget}</span></p>
                <p>Weekly Budget: <span className="font-bold">RM {s.weeklyBudget}</span></p>
                <p>Daily Budget: <span className="font-bold">RM {s.dailyBudget}</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer */}
      <motion.div
        whileHover={{ scale: 1.1, rotateX: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="mt-10 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-xl text-sm"
      >
        &copy; 2025 - Created by Ikmal Rizal
      </motion.div>
    </div>
  );
}
