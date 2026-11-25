import { useState } from 'react'
import { ArrowRight, ArrowLeft, Copy, Check, Sparkle } from '@phosphor-icons/react'
import { useLang } from '../i18n.tsx'
import { Reveal, SectionHead } from './ui.tsx'

type Tone = 'friendly' | 'formal' | 'concise'

export function HeroDemo() {
  const { t, ta, lang } = useLang()
  const samples = ta<{ label: string; before: string; friendly: string; formal: string; concise: string }>('demo.samples')
  const [idx, setIdx] = useState(0)
  const [tone, setTone] = useState<Tone>('friendly')
  const [loading, setLoading] = useState(false)
  const [showAfter, setShowAfter] = useState(false)
  const [copied, setCopied] = useState(false)
  const sample = samples[idx]
  if (!sample) return null
  const tones: Tone[] = ['friendly', 'formal', 'concise']
  const rewrite = () => {
    setLoading(true)
    setShowAfter(false)
    window.setTimeout(() => { setLoading(false); setShowAfter(true) }, 700)
  }
  const after = sample[tone]
  const copy = async () => {
    try { await navigator.clipboard.writeText(after); setCopied(true); window.setTimeout(() => setCopied(false), 2000) } catch { /* clipboard unavailable */ }
  }
  return (
    <div className="rounded-2xl border p-4 sm:p-8" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={t('demo.sampleLabel')}>
        {samples.map((s, i) => (
          <button key={i} type="button" role="tab" aria-selected={idx === i} onClick={() => { setIdx(i); setShowAfter(false) }} className="button-sm rounded-full border px-4 py-2" style={{ borderColor: 'var(--color-muted)', background: idx === i ? 'var(--color-accent)' : 'transparent', color: idx === i ? '#fff' : 'inherit' }}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <p className="caption-4 mb-4 uppercase tracking-wide opacity-70">{t('demo.before')}</p>
          <p className="body-3 rounded-xl border p-4" style={{ borderColor: 'var(--color-muted)' }}>{sample.before}</p>
        </div>
        <div>
          <p className="caption-4 mb-4 uppercase tracking-wide opacity-70">{t('demo.after')}</p>
          {loading ? (
            <div className="skeleton h-32 rounded-xl" role="status" aria-label={t('demo.loading')} />
          ) : showAfter ? (
            <p className="body-3 rounded-xl border p-4" style={{ borderColor: 'var(--color-accent)' }}>{after}</p>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-4 text-center" style={{ borderColor: 'var(--color-muted)' }}>
              <Sparkle size={24} style={{ color: 'var(--color-accent)' }} />
              <p className="body-6 opacity-70">{t('demo.empty')}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="caption-4 me-2 opacity-70">{t('demo.toneLabel')}</span>
        {tones.map((tn) => (
          <button key={tn} type="button" onClick={() => setTone(tn)} aria-pressed={tone === tn} className="button-sm rounded-full border px-4 py-2" style={{ borderColor: 'var(--color-muted)', background: tone === tn ? 'var(--color-accent)' : 'transparent', color: tone === tn ? '#fff' : 'inherit' }}>
            {t(`demo.tone_${tn}`)}
          </button>
        ))}
        <span className="ms-auto flex gap-2">
          <button type="button" onClick={rewrite} disabled={loading} className="btn-primary button-sm">
            {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            {loading ? t('demo.rewriting') : t('demo.rewrite')}
          </button>
          {showAfter ? (
            <button type="button" onClick={copy} className="btn-ghost button-sm">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t('demo.copied') : t('demo.copy')}</button>
          ) : null}
        </span>
      </div>
    </div>
  )
}

export function Examples() {
  const { t, ta } = useLang()
  const pairs = ta<{ title: string; before: string; after: string }>('examples.pairs')
  return (
    <section id="examples" aria-labelledby="examples-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
      <SectionHead eyebrow={t('examples.eyebrow')} title={t('examples.title')} sub={t('examples.sub')} />
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {pairs.map((p, i) => (
          <Reveal key={i}>
            <article className="h-full rounded-2xl border p-8" style={{ borderColor: 'var(--color-muted)' }}>
              <h3 className="title-1">{p.title}</h3>
              <p className="caption-4 mt-8 uppercase tracking-wide opacity-60">{t('examples.before')}</p>
              <p className="body-6 mt-2 opacity-70 line-through decoration-2">{p.before}</p>
              <p className="caption-4 mt-8 uppercase tracking-wide opacity-60">{t('examples.after')}</p>
              <p className="body-3 mt-2">{p.after}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
