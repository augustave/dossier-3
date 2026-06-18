import React, { useState } from 'react';
import { Fold } from './Fold';

interface CollapsibleDrawerProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export const CollapsibleDrawer: React.FC<CollapsibleDrawerProps> = ({ title, children, defaultOpen = false, icon }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-current/20 pb-4">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="flex items-center gap-3 w-full text-left font-mono text-xs uppercase tracking-widest font-bold opacity-secondary hover:opacity-primary transition-opacity group/drawer"
            >
                {icon}
                <span className="group-hover/drawer:underline underline-offset-4">{title}</span>
                <span className="ml-auto opacity-50">{isOpen ? '[-]' : '[+]'}</span>
            </button>
            <Fold open={isOpen}>
                {/* mt-4 on an inner child, not .fold__inner, so it collapses
                    to nothing when folded (no leftover margin sliver). */}
                <div className="mt-4">{children}</div>
            </Fold>
        </div>
    );
};
