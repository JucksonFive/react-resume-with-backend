import classNames from 'classnames';
import { FC, memo, UIEventHandler, useCallback, useEffect, useRef, useState } from 'react';

import { SectionId, testimonial } from '../../data/data';
import type { Testimonial } from '../../data/dataDef';
import useInterval from '../../hooks/useInterval';
import useWindow from '../../hooks/useWindow';
import QuoteIcon from '../Icon/QuoteIcon';
import Reveal from '../motion/Reveal';

const HEADING_ID = 'testimonials-heading';

const Testimonials: FC = memo(() => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrollValue, setScrollValue] = useState(0);

  const itemWidth = useRef(0);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const {width} = useWindow();

  // NOTE: `imageSrc` from testimonial data is intentionally unused in the new editorial layout.
  const {testimonials} = testimonial;

  useEffect(() => {
    itemWidth.current = scrollContainer.current ? scrollContainer.current.offsetWidth : 0;
  }, [width]);

  useEffect(() => {
    if (scrollContainer.current) {
      const newIndex = Math.round(scrollContainer.current.scrollLeft / itemWidth.current);
      setActiveIndex(newIndex);
    }
  }, [itemWidth, scrollValue]);

  const setTestimonial = useCallback(
    (index: number) => () => {
      if (scrollContainer !== null && scrollContainer.current !== null) {
        scrollContainer.current.scrollLeft = itemWidth.current * index;
      }
    },
    [],
  );
  const next = useCallback(() => {
    if (activeIndex + 1 === testimonials.length) {
      setTestimonial(0)();
    } else {
      setTestimonial(activeIndex + 1)();
    }
  }, [activeIndex, setTestimonial, testimonials.length]);

  const handleScroll = useCallback<UIEventHandler<HTMLDivElement>>(event => {
    setScrollValue(event.currentTarget.scrollLeft);
  }, []);

  useInterval(next, 10000);

  if (!testimonials.length) {
    return null;
  }

  return (
    <section
      aria-labelledby={HEADING_ID}
      className="bg-[#f7f3ea] py-24 sm:py-32 lg:py-40 border-y border-border"
      id={SectionId.Testimonials}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Words to live by</p>
          <h2
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground"
            id={HEADING_ID}>
            Thoughts I steal often.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col items-center gap-y-8">
            <div
              className="no-scrollbar flex w-full touch-pan-x snap-x snap-mandatory gap-x-6 overflow-x-auto scroll-smooth"
              onScroll={handleScroll}
              ref={scrollContainer}>
              {testimonials.map((t, index) => (
                <TestimonialCard isActive={index === activeIndex} key={`${t.name}-${index}`} testimonial={t} />
              ))}
            </div>
            <div className="flex gap-x-3">
              {testimonials.map((t, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={classNames(
                      'rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isActive
                        ? 'h-2 w-6 bg-primary shadow-[0_0_12px_rgba(124,58,237,0.6)]'
                        : 'h-2 w-2 bg-border hover:bg-muted-foreground hover:scale-110',
                    )}
                    key={`dot-${t.name}-${index}`}
                    onClick={setTestimonial(index)}
                    type="button"
                  />
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
});

const TestimonialCard: FC<{testimonial: Testimonial; isActive: boolean}> = memo(
  ({testimonial: {text, name}, isActive}) => (
    <div
      className={classNames(
        'flex w-full shrink-0 snap-start snap-always flex-col items-start gap-6 rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-left will-change-[opacity,transform]',
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]',
      )}>
      <QuoteIcon className="h-8 w-8 shrink-0 text-primary/70" />
      <p className="text-lg sm:text-xl leading-relaxed text-foreground font-medium italic">{text}</p>
      <p className="mt-2 text-sm font-medium text-foreground not-italic">{name}</p>
    </div>
  ),
);

TestimonialCard.displayName = 'TestimonialCard';
Testimonials.displayName = 'Testimonials';

export default Testimonials;
