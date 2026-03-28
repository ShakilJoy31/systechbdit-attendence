"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, MessageSquare, TrendingUp } from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';
import { AudienceStats } from '@/redux/api/sms-configurations/audienceApi';

interface AudienceStatsCardsProps {
  stats: AudienceStats;
  clientId: string | number;
}

const AudienceStatsCards: React.FC<AudienceStatsCardsProps> = ({ stats }) => {
  const { theme } = useTheme();

  const statCards = [
    {
      icon: Users,
      label: "Total Audiences",
      value: stats.totalAudiences,
      color: "blue",
      description: "Total audience lists"
    },
    {
      icon: Phone,
      label: "Total Phone Numbers",
      value: stats.totalPhoneNumbers,
      color: "green",
      description: "Across all audiences"
    },
    {
      icon: MessageSquare,
      label: "Avg Numbers/Audience",
      value: parseFloat(stats.averageNumbersPerAudience).toFixed(1),
      color: "purple",
      description: "Average size"
    },
    {
      icon: TrendingUp,
      label: "Audiences by Config",
      value: Object.keys(stats.audiencesByConfig || {}).length,
      color: "yellow",
      description: "Different SMS configurations"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl py-6 px-2 md:px-4 lg:px-6 shadow-lg mb-6 transition-colors duration-300 ${
        theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      } border`}
    >
      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        <TrendingUp size={20} />
        Audience Statistics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-colors duration-300 ${
              theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
            </div>
            <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stat.label}
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Config Breakdown */}
      {Object.keys(stats.audiencesByConfig || {}).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Breakdown by SMS Configuration
          </h4>
          <div className="space-y-3">
            {Object.entries(stats.audiencesByConfig).map(([configName, configStats], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-100/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {configName}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {configStats.audienceCount} audiences
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {configStats.phoneNumberCount} numbers
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AudienceStatsCards;