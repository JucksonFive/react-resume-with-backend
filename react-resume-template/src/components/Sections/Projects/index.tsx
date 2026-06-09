import {SearchX} from 'lucide-react';
import {FC, memo, useCallback, useMemo, useState} from 'react';

import {PortfolioItem} from '../../../data/dataDef';
import usePortfolioItems from '../../../hooks/usePortfolioItems';
import Reveal from '../../motion/Reveal';
import {StaggerGroup, StaggerItem} from '../../motion/Stagger';

import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

type Category = 'all' | 'audio' | 'fullstack' | 'game';

const CATEGORIES: readonly {value: Category; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'audio', label: 'Audio'},
  {value: 'fullstack', label: 'Fullstack'},
  {value: 'game', label: 'Game'},
] as const;

const Skeleton: FC = () => (
  <div className="flex flex-col gap-3">
    <div className="aspect-[16/10] animate-pulse rounded-2xl bg-muted" />
    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
    <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
  </div>
);

const Projects: FC = memo(() => {
  const {data, isLoading, error, refetch} = usePortfolioItems();
  const [filter, setFilter] = useState<Category>('all');
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const handleSelect = useCallback((item: PortfolioItem) => setSelected(item), []);
  const handleClose = useCallback(() => setSelected(null), []);

  const filtered = useMemo(() => {
    if (filter === 'all') return data;
    return data.filter(item => item.category === filter);
  }, [data, filter]);

  return (
    <section className="bg-background py-24 sm:py-32 lg:py-40" id="projects">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Selected work</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Things I&apos;ve actually shipped.
          </h2>
        </Reveal>

        <div className="sticky top-16 z-20 mt-10 -mx-4 bg-background/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:sticky lg:mx-0 lg:rounded-full lg:border lg:border-border lg:px-4">
          <div aria-label="Filter projects by category" className="flex w-full flex-wrap justify-start gap-1" role="group">
            {CATEGORIES.map(c => {
              const isActive = filter === c.value;
              return (
                <button
                  aria-pressed={isActive}
                  className="cursor-pointer rounded-full px-4 py-1.5 text-sm transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_18px_-10px_rgba(124,58,237,0.5)] active:translate-y-0 active:scale-[0.98] aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-[0_8px_22px_-12px_rgba(124,58,237,0.55)] motion-reduce:transition-none motion-reduce:hover:transform-none"
                  key={c.value}
                  onClick={() => setFilter(c.value)}
                  type="button">
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          {error ? (
            <div
              className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-red-800"
              role="alert">
              Couldn&apos;t load projects.{' '}
              <button className="underline" onClick={refetch} type="button">
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({length: 6}).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <SearchX aria-hidden="true" className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">No projects in this category yet — check back soon.</p>
            </div>
          ) : (
            <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" key={filter} stagger={0.06}>
              {filtered.map((item, i) => (
                <StaggerItem direction="up" key={`${item.title}-${i}`}>
                  <ProjectCard item={item} onSelect={handleSelect} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </div>
      <ProjectModal item={selected} onClose={handleClose} />
    </section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
