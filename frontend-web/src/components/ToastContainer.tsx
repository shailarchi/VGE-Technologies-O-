import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  TrendingDown, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Bell, 
  Zap,
  Info
} from 'lucide-react';

export interface AssetAlertToast {
  id: string;
  timestamp: string;
  assetId: string;
  assetName: string;
  type: 'critical_error' | 'production_drop' | 'warning' | 'info';
  errorCode?: string;
  title: string;
  message: string;
  dropPercentage?: number;
  inverterId?: string;
  read?: boolean;
}

interface ToastContainerProps {
  toasts: AssetAlertToast[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onInspectAsset?: (assetId: string, inverterId?: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onClearAll,
  onInspectAsset
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      
      {/* Toast Clear All Header if multiple */}
      {toasts.length > 2 && (
        <div className="pointer-events-auto self-end flex items-center gap-2 bg-[#0F172A]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-slate-300 shadow-lg">
          <Bell className="w-3.5 h-3.5 text-[#4ADE80] animate-bounce" />
          <span>{toasts.length} Active System Alerts</span>
          <button
            onClick={onClearAll}
            className="text-[#4ADE80] hover:underline font-bold ml-1 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isCritical = toast.type === 'critical_error';
          const isDrop = toast.type === 'production_drop';
          const isWarning = toast.type === 'warning';

          const borderColor = isCritical
            ? 'border-red-500/60'
            : isDrop
            ? 'border-amber-500/60'
            : isWarning
            ? 'border-yellow-500/60'
            : 'border-[#16A34A]/60';

          const bgColor = isCritical
            ? 'bg-[#1E1215]/95'
            : isDrop
            ? 'bg-[#1E1912]/95'
            : isWarning
            ? 'bg-[#1E1B10]/95'
            : 'bg-[#0F172A]/95';

          const iconColor = isCritical
            ? 'text-red-400'
            : isDrop
            ? 'text-amber-400'
            : isWarning
            ? 'text-yellow-400'
            : 'text-[#4ADE80]';

          const badgeBg = isCritical
            ? 'bg-red-500/20 text-red-300 border-red-500/40'
            : isDrop
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : isWarning
            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
            : 'bg-[#16A34A]/20 text-[#4ADE80] border-[#16A34A]/40';

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto p-4 rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-md shadow-2xl relative overflow-hidden`}
            >
              {/* Top Pulse Glow Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isCritical
                    ? 'bg-red-500 animate-pulse'
                    : isDrop
                    ? 'bg-amber-500'
                    : isWarning
                    ? 'bg-yellow-500'
                    : 'bg-[#16A34A]'
                }`}
              />

              <div className="flex items-start justify-between gap-3">
                
                {/* Icon */}
                <div className={`p-2 rounded-xl bg-white/5 shrink-0 ${iconColor}`}>
                  {isCritical ? (
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  ) : isDrop ? (
                    <TrendingDown className="w-5 h-5" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 font-mono text-xs">
                  
                  {/* Header metadata */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${badgeBg}`}>
                      {toast.errorCode ? `CODE: ${toast.errorCode}` : isDrop ? `DROP -${toast.dropPercentage}%` : toast.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{toast.timestamp}</span>
                  </div>

                  {/* Title & Asset */}
                  <h4 className="font-bold text-white text-sm tracking-tight truncate">
                    {toast.title}
                  </h4>
                  
                  <p className="text-[#94A3B8] text-[11px] mt-0.5 leading-snug line-clamp-2">
                    {toast.message}
                  </p>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-semibold truncate max-w-[180px]">
                      📍 {toast.assetName} {toast.inverterId ? `(${toast.inverterId})` : ''}
                    </span>

                    {onInspectAsset && (
                      <button
                        onClick={() => onInspectAsset(toast.assetId, toast.inverterId)}
                        className="text-[#4ADE80] hover:text-white flex items-center gap-1 font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Inspect
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                </div>

                {/* Close Button */}
                <button
                  onClick={() => onDismiss(toast.id)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

    </div>
  );
};
