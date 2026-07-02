import { useState, useEffect, useRef } from 'react';
import { useHelp } from '@/contexts/HelpContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { X, Loader2, BookOpen } from 'lucide-react';

const HELP_BASE = '/help/';

export function HelpOverlay() {
  const { isOpen, helpFile, helpTitle, closeHelp } = useHelp();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !helpFile) return;
    setLoading(true);
    setError(false);
    setContent('');

    fetch(`${HELP_BASE}${helpFile}.md`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [isOpen, helpFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative flex h-[90vh] w-[90vw] max-w-5xl flex-col rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{helpTitle || 'Manual de Treinamento'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:inline-block">
              Ctrl+Shift+H
            </kbd>
            <button
              onClick={closeHelp}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6">
          {loading && (
            <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Carregando...</span>
            </div>
          )}

          {error && (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
              <BookOpen className="h-8 w-8" />
              <p>Ajuda não disponível para esta tela.</p>
              <p className="text-sm">Consulte o Manual do Usuário em <strong>Ajuda &gt; Manual</strong></p>
            </div>
          )}

          {!loading && !error && content && (
            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
