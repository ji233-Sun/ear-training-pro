'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MODULE_CONFIG, type ModuleKey } from '@/lib/constants';
import { useState } from 'react';
import {
  Music, Piano, ListMusic, Drum, PenLine, AudioLines, Volume2, BookOpen,
  LayoutDashboard, Menu, X, Music2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Music, Piano, ListMusic, Drum, PenLine, AudioLines, Volume2, BookOpen,
};

const modules = Object.entries(MODULE_CONFIG) as [ModuleKey, typeof MODULE_CONFIG[ModuleKey]][];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        {collapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-zinc-200 bg-white transition-transform ${
        collapsed ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-6">
          <Music2 className="h-7 w-7 text-blue-600" />
          <div>
            <h1 className="text-base font-bold text-zinc-900">视唱练耳训练</h1>
            <p className="text-xs text-zinc-500">Ear Training Pro</p>
          </div>
        </div>

        {/* Dashboard link */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <Link
            href="/"
            onClick={() => setCollapsed(false)}
            className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'bg-blue-50 text-blue-700'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>仪表盘</span>
          </Link>

          <div className="mb-2 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            训练模块
          </div>

          {modules.map(([key, config]) => {
            const isActive = pathname === config.path;
            const Icon = ICON_MAP[config.icon];
            return (
              <Link
                key={key}
                href={config.path}
                onClick={() => setCollapsed(false)}
                className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{config.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-200 px-4 py-3">
          <p className="text-xs text-zinc-400">
            快捷键：空格重播 / 数字键选择
          </p>
        </div>
      </aside>
    </>
  );
}
