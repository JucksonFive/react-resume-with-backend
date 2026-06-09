import {animate, motion, useInView, useMotionValue, useReducedMotion, useTransform} from 'framer-motion';
import {FC, useEffect, useRef} from 'react';

import ExpertiseTile from '../ExpertiseTile';

const SHIPPING_SINCE = new Date('2022-05-01T00:00:00Z');

const yearsSince = (from: Date): number => {
  const now = new Date();
  const diffMs = now.getTime() - from.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.round(years));
};

interface Metric {
  value: number;
  suffix: string;
  label: string;
}

const METRICS: readonly Metric[] = [
  {value: yearsSince(SHIPPING_SINCE), suffix: '', label: 'Years shipping software'},
  {value: 3, suffix: '', label: 'Features in production'},
  {value: 10000, suffix: '+', label: 'Users reached monthly'},
] as const;

interface CountProps {
  target: number;
  suffix: string;
}

const Count: FC<CountProps> = ({target, suffix}) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {once: true, amount: 0.2});
  const mv = useMotionValue(shouldReduceMotion ? target : 0);
  const rounded = useTransform(mv, latest => Math.round(latest).toString());

  useEffect(() => {
    if (shouldReduceMotion) {
      mv.set(target);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, target, {duration: 1.4, ease: [0.22, 1, 0.36, 1]});
    return () => controls.stop();
  }, [inView, mv, shouldReduceMotion, target]);

  // Fallback: jos IntersectionObserver ei syystä tai toisesta laukea
  // (esim. pienet viewport-ongelmat mobiililla), aseta arvo viiveellä.
  useEffect(() => {
    if (shouldReduceMotion) return;
    const timeout = window.setTimeout(() => {
      if (mv.get() === 0 && target !== 0) {
        const controls = animate(mv, target, {duration: 1.4, ease: [0.22, 1, 0.36, 1]});
        return () => controls.stop();
      }
      return undefined;
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [mv, shouldReduceMotion, target]);

  return (
    <span className="inline-flex items-baseline tabular-nums">
      <motion.span ref={ref}>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
};

const ImpactMetricsTile: FC = () => {
  return (
    <ExpertiseTile eyebrow="Impact" title="Numbers that matter.">
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {METRICS.map(m => (
          <div className="flex flex-col" key={m.label}>
            <dd className="text-4xl font-semibold tabular-nums text-violet-600 bg-gradient-to-br from-violet-600 via-violet-500 to-violet-400 bg-clip-text text-transparent sm:text-5xl">
              <Count suffix={m.suffix} target={m.value} />
            </dd>
            <dt className="mt-1 text-sm text-muted-foreground">{m.label}</dt>
          </div>
        ))}
      </dl>
    </ExpertiseTile>
  );
};

ImpactMetricsTile.displayName = 'ImpactMetricsTile';

export default ImpactMetricsTile;
