import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { INQUIRY_OPTIONS, INQUIRY_QUESTIONS } from '../constants';
import { InquiryState } from '../types';
import { useClipboard } from '../hooks/useClipboard';
import { CONTACT, hasLinkedIn } from '../contact';
import { XIcon, CopyIcon, MailIcon, DownloadIcon, CheckIcon, AlertCircleIcon, AlertTriangleIcon } from './icons';

interface InquiryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  contactEmail?: string;
}

const MAX_QUESTIONS = 5;

const getInitialState = (context?: string): InquiryState => ({
  assess: [],
  challenge: [],
  note: context ? `Regarding: ${context}\n` : ''
});

export const InquiryPanel: React.FC<InquiryPanelProps> = ({ isOpen, onClose, context, contactEmail = '' }) => {
  const [state, setState] = useState<InquiryState>(() => getInitialState(context));
  // Resolve to the passed-in email, else the hardcoded CONTACT constant, so the
  // email path is always live regardless of build configuration.
  const resolvedEmail = (contactEmail.trim() || CONTACT.email);
  const normalizedContactEmail = resolvedEmail;
  const hasContactEmail = normalizedContactEmail.length > 0;
  const mailtoDisabledReason = 'No contact email configured.';
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const downloadResetTimerRef = useRef<number | null>(null);
  const downloadStatusId = 'inquiry-download-status';
  const { copy, copied } = useClipboard();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<Element | null>(null);
  const copyStatusId = 'inquiry-copy-status';
  const dialogDescId = 'inquiry-dialog-description';

  useEffect(() => {
    if (!isOpen) return;
    setState(getInitialState(context));
  }, [context, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    lastFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (downloadResetTimerRef.current !== null) {
        window.clearTimeout(downloadResetTimerRef.current);
      }
    };
  }, []);

  const toggleSelection = (category: 'assess' | 'challenge', item: string) => {
    setState(prev => {
      const list = prev[category];
      if (list.includes(item)) {
        return { ...prev, [category]: list.filter(i => i !== item) };
      }
      return { ...prev, [category]: [...list, item] };
    });
  };

  const getQuestions = (): { questions: string[]; truncated: number } => {
    let questions: string[] = [];

    // Rule: pick 2 questions per "Assess" item
    state.assess.forEach(item => {
      const pool = INQUIRY_QUESTIONS[item] || [];
      questions = [...questions, ...pool.slice(0, 2)];
    });

    // Rule: pick 2 questions per "Challenge" item (Prompt said 1-2, prioritizing 2 for coverage)
    state.challenge.forEach(item => {
      const pool = INQUIRY_QUESTIONS[item] || [];
      questions = [...questions, ...pool.slice(0, 2)];
    });

    // Cap at MAX_QUESTIONS total questions to keep it punchy
    const truncated = Math.max(0, questions.length - MAX_QUESTIONS);
    return { questions: questions.slice(0, MAX_QUESTIONS), truncated };
  };

  const generateMessage = () => {
    const { questions } = getQuestions();
    const assessList = state.assess.length > 0 ? state.assess.join(', ') : '(None)';
    const challengeList = state.challenge.length > 0 ? state.challenge.join(', ') : '(None)';
    const contextStr = context || 'CT DOSSIER';

    return `
CONVERSATION REQUEST — ${assessList} / ${challengeList}

Hi Ebenz — I reviewed your ${contextStr}.

I want to discuss: ${assessList}
I want to evaluate: ${challengeList}

Questions:
${questions.length > 0 ? questions.map((q, i) => `${i + 1}. ${q}`).join('\n') : '(Select areas to generate questions)'}

${state.note ? `\nContext/Notes:\n${state.note}` : ''}

If helpful, I would be open to a short conversation.
    `.trim();
  };

  const handleCopy = async () => {
    await copy(generateMessage());
  };

  const handleMailto = () => {
    if (!hasContactEmail) return;
    const assessList = state.assess.length > 0 ? state.assess.join(', ') : 'None';
    const challengeList = state.challenge.length > 0 ? state.challenge.join(', ') : 'None';
    const subject = encodeURIComponent(`CONVERSATION REQUEST — ${assessList} / ${challengeList}`);
    const body = encodeURIComponent(generateMessage());
    window.location.href = `mailto:${normalizedContactEmail}?subject=${subject}&body=${body}`;
  };

  const handleDownload = () => {
    let objectUrl: string | null = null;
    let element: HTMLAnchorElement | null = null;
    try {
      element = document.createElement("a");
      const file = new Blob([generateMessage()], {type: 'text/plain'});
      objectUrl = URL.createObjectURL(file);
      element.href = objectUrl;
      element.download = "ct_dossier_inquiry.txt";
      document.body.appendChild(element);
      element.click();
      setDownloadStatus('done');
    } catch (err) {
      console.error('Inquiry download failed', err);
      setDownloadStatus('error');
    } finally {
      if (element && element.parentNode === document.body) {
        document.body.removeChild(element);
      }
      if (objectUrl !== null) {
        URL.revokeObjectURL(objectUrl);
      }
      if (downloadResetTimerRef.current !== null) {
        window.clearTimeout(downloadResetTimerRef.current);
      }
      downloadResetTimerRef.current = window.setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && !el.hasAttribute('hidden') && el.tabIndex !== -1);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] grid place-items-center p-4 md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={onClose}
        />

        {/* Panel Content */}
        <div 
            ref={panelRef}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-title"
            aria-describedby={dialogDescId}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="p-8 border-b border-black/10 flex justify-between items-start bg-strata-cream">
            <div>
              <h2 id="inquiry-title" className="font-sans text-3xl font-bold uppercase tracking-tightest">Inquiry</h2>
              <p id={dialogDescId} className="sr-only">
                Client-side inquiry composer. Press Escape to close this panel.
              </p>
              <div className="font-mono text-xs opacity-muted mt-2 space-y-1">
                <p>NO API. CLIENT-SIDE GENERATION ONLY.</p>
                <p>THIS DOES NOT SEND. IT PREPARES OUTREACH.</p>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close inquiry panel"
              className="p-2 hover:bg-black text-black hover:text-white transition-colors border border-transparent hover:border-black"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-8 space-y-12 flex-grow overflow-y-auto">

            {/* Direct contact — always available, no composing required.
                Added 2026-06-10 so the panel never dead-ends: a visitor who just
                wants to reach out has a one-click path before the composer. */}
            <div className="border border-black bg-strata-cream p-5">
              <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-3">
                00. Reach Out Directly
              </h3>
              <div className="flex flex-col gap-2">
                <a
                  href={`mailto:${resolvedEmail}`}
                  className="font-mono text-sm border-b border-black w-fit hover:bg-black hover:text-white transition-colors"
                >
                  {resolvedEmail}
                </a>
                {hasLinkedIn && (
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm border-b border-black w-fit hover:bg-black hover:text-white transition-colors"
                  >
                    LinkedIn -&gt;
                  </a>
                )}
              </div>
              <p className="font-mono text-micro uppercase tracking-wider opacity-muted mt-3">
                Prefer to be specific? Use the composer below — it drafts a message you can send.
              </p>
            </div>

            {/* Section 1: Assess */}
            <div>
               <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4 border-b border-black pb-2">
                01. I want to Discuss
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {INQUIRY_OPTIONS.assess.map(opt => (
                   <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 border border-black flex items-center justify-center transition-colors ${state.assess.includes(opt) ? 'bg-black text-white' : 'bg-transparent'}`}>
                       {state.assess.includes(opt) && <CheckIcon className="w-3 h-3" />}
                     </div>
                     <input 
                       type="checkbox" 
                       className="hidden" 
                       checked={state.assess.includes(opt)}
                       onChange={() => toggleSelection('assess', opt)}
                     />
                     <span className="font-sans text-sm font-medium group-hover:underline">{opt}</span>
                   </label>
                 ))}
               </div>
            </div>

            {/* Section 2: Challenge */}
            <div>
               <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4 border-b border-black pb-2">
                02. I want to Evaluate
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {INQUIRY_OPTIONS.challenge.map(opt => (
                   <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 border border-black flex items-center justify-center transition-colors ${state.challenge.includes(opt) ? 'bg-black text-white' : 'bg-transparent'}`}>
                       {state.challenge.includes(opt) && <CheckIcon className="w-3 h-3" />}
                     </div>
                     <input 
                       type="checkbox" 
                       className="hidden" 
                       checked={state.challenge.includes(opt)}
                       onChange={() => toggleSelection('challenge', opt)}
                     />
                     <span className="font-sans text-sm font-medium group-hover:underline">{opt}</span>
                   </label>
                 ))}
               </div>
            </div>

             {/* Section 3: Notes */}
             <div>
               <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4 border-b border-black pb-2">
                03. Specific Context
               </h3>
               <textarea 
                 className="w-full h-32 p-4 font-mono text-sm bg-white border border-black/20 focus:border-black focus:outline-none resize-none placeholder-gray-400"
                 placeholder="Enter any specific context here (this appends to the message)..."
                 value={state.note}
                 onChange={(e) => setState({...state, note: e.target.value})}
               />
            </div>

            {/* Preview */}
            {(() => {
              const { questions, truncated } = getQuestions();
              return (
                <div className="bg-black/5 p-4 border border-black/10 font-mono text-xs text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircleIcon className="w-3 h-3" />
                    <span className="uppercase tracking-wider">Preview Generated Questions</span>
                  </div>
                  {questions.length > 0 ? (
                    <>
                      <ul className="space-y-1 list-disc pl-4">
                        {questions.map((q, i) => <li key={i}>{q}</li>)}
                      </ul>
                      {truncated > 0 && (
                        <div className="flex items-center gap-2 mt-3 text-amber-600">
                          <AlertTriangleIcon className="w-3 h-3" />
                          <span className="uppercase tracking-wider">
                            {truncated} question{truncated > 1 ? 's' : ''} omitted (max {MAX_QUESTIONS})
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="italic">Select items above to populate outreach questions.</span>
                  )}
                </div>
              );
            })()}

          </div>

          {/* Footer / Actions */}
          <div className="p-8 border-t border-black/10 bg-gray-50">
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCopy}
                aria-describedby={copyStatusId}
                className="w-full flex items-center justify-center gap-2 bg-black text-white p-4 font-mono text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                {copied ? 'COPIED TO CLIPBOARD' : 'COPY MESSAGE'}
              </button>
              <span id={copyStatusId} className="sr-only" role="status" aria-live="polite">
                {copied ? 'Inquiry message copied to clipboard.' : ''}
              </span>
              <div className="grid grid-cols-2 gap-3">
                 <button 
                  onClick={handleMailto}
                  disabled={!hasContactEmail}
                  title={hasContactEmail ? undefined : mailtoDisabledReason}
                  className="flex items-center justify-center gap-2 border border-black p-3 font-mono text-xs uppercase hover:bg-black/5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                 >
                   <MailIcon className="w-3 h-3" /> {hasContactEmail ? 'EMAIL DRAFT' : 'EMAIL DISABLED'}
                 </button>
                 <button 
                  onClick={handleDownload}
                  aria-describedby={downloadStatusId}
                  className="flex items-center justify-center gap-2 border border-black p-3 font-mono text-xs uppercase hover:bg-black/5 transition-colors"
                 >
                   <DownloadIcon className="w-3 h-3" /> .TXT FILE
                 </button>
              </div>
              <span id={downloadStatusId} className="sr-only" role="status" aria-live="polite">
                {downloadStatus === 'done' ? 'Inquiry text file downloaded.' : ''}
                {downloadStatus === 'error' ? 'Download failed. Copy the message instead.' : ''}
              </span>
              {downloadStatus === 'error' && (
                <p className="font-mono text-xs uppercase tracking-wider text-red-700 flex items-center gap-2">
                  <AlertTriangleIcon className="w-3 h-3" />
                  Download failed. Copy the message instead.
                </p>
              )}
              {!hasContactEmail && (
                <p className="font-mono text-xs uppercase tracking-wider text-amber-700">
                  {mailtoDisabledReason}
                </p>
              )}
            </div>
          </div>

        </div>
    </div>,
    document.body
  );
};
