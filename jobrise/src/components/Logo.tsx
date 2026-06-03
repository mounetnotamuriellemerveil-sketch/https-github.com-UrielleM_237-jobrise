/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  compact?: boolean;
}

export default function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0d1b30] border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 18.5 L9.2 12 L13 15.2 L21 6"
            stroke="#00B86B"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 6 H21 V11.5"
            stroke="#F5C451"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="text-lg font-black tracking-tight text-white">
            JOB<span className="text-emerald-400">Rise</span>
          </span>
          <span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-500 -mt-0.5">
            Cameroon
          </span>
        </span>
      )}
    </div>
  );
}
