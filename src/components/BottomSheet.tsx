import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Prevent background scrolling when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100]"
          />
          {/* Sheet container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[2.5rem] border-t border-border shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-[101] flex flex-col overflow-hidden"
          >
            {/* Header/Drag handle */}
            <div className="flex flex-col items-center pt-3 pb-2 border-b border-border/40 bg-white sticky top-0 shrink-0">
              <div className="w-12 h-1.5 bg-muted/30 rounded-full mb-3" />
              <div className="w-full px-6 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-teal truncate mr-4">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-muted hover:text-text active:scale-90 transition-transform cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
