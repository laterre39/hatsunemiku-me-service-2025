import React from 'react';

export interface VocaloidBirthday {
    name: string;
    month: number;
    day: number;
    year: number;
    color: string;
    dDayText: string;
    isHighlight: boolean;
    sortKey: number;
    anniversary: number;
}

export const BirthdayListItem = ({ vocaloid }: { vocaloid: VocaloidBirthday }) => (
    <li
        className={`col-span-2 flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-300 hover:bg-slate-50 ${vocaloid.isHighlight ? 'bg-pink-50/50 ring-1 ring-pink-100' : ''}`}
    >
        <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-xs font-medium text-gray-400 w-9 text-center tabular-nums flex-shrink-0">
                {vocaloid.month.toString().padStart(2, '0')}.{vocaloid.day.toString().padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2 min-w-0 flex-1">
                <div 
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: vocaloid.color }}
                />
                <span className="text-sm font-bold text-gray-700 truncate">
                    {vocaloid.name}
                </span>
            </div>
        </div>

        <div className="flex items-center justify-end w-20 flex-shrink-0">
            {vocaloid.isHighlight ? (
                <span 
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md animate-pulse whitespace-nowrap bg-gradient-to-r from-pink-500 to-rose-500"
                >
                    {vocaloid.anniversary}th 🎉
                </span>
            ) : (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full min-w-[3.5rem] text-center whitespace-nowrap shadow-sm border ${
                    vocaloid.sortKey <= 7 
                        ? 'bg-rose-50 text-rose-600 border-rose-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-100'
                }`}>
                    {vocaloid.dDayText}
                </span>
            )}
        </div>
    </li>
);
