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
        className={`col-span-2 grid grid-cols-subgrid items-center rounded-md px-2 py-1 transition-colors duration-300`}
        style={vocaloid.isHighlight ? {
            backgroundColor: `${vocaloid.color}20`,
            borderLeft: `4px solid ${vocaloid.color}`
        } : {}}
    >
        <span
            className={`font-semibold ${!vocaloid.isHighlight ? 'underline underline-offset-4 decoration-4' : ''}`}
            style={!vocaloid.isHighlight ? { color: vocaloid.color, textDecorationColor: vocaloid.color } : { color: vocaloid.color }}
        >
            {vocaloid.name}
        </span>
        <div className="justify-self-end flex items-center gap-2 font-bold text-gray-700">
            {vocaloid.isHighlight ? (
                <span className="text-white font-bold px-2.5 py-1 rounded-full text-sm"
                      style={{ backgroundColor: vocaloid.color }}>{vocaloid.anniversary}th Anniversary</span>
            ) : (
                <span className="tabular-nums">{vocaloid.dDayText}</span>
            )}
        </div>
    </li>
);
