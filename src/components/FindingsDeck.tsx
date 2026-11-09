import React, { useState, useEffect } from 'react';
import { EIGHT_SLIDES } from '../data/agriData';
import { ChevronLeft, ChevronRight, Presentation, CheckCircle, Share2, Printer } from 'lucide-react';
import { TabId } from './Header';

interface FindingsDeckProps {
  onNavigate: (tab: TabId) => void;
}

export const FindingsDeck: React.FC<FindingsDeckProps> = ({ onNavigate }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const slides = EIGHT_SLIDES;
  const currentSlide = slides[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      {/* Deck Controls Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Presentation className="w-4 h-4" />
            <span>Executive Findings Deck</span>
            <span aria-hidden="true">·</span>
            <span>Nagpur Agritech Board & Sourcing Committee</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            District Crop Yield Forecasting & Procurement Roadmap
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold px-2 text-slate-800 dark:text-slate-200">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Slides</span>
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Quick Navigation */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl overflow-x-auto no-scrollbar">
        {slides.map((slide, idx) => {
          const isCurrent = currentSlideIndex === idx;
          return (
            <button
              key={slide.slideNumber}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-2 rounded-lg text-left transition-all ${
                isCurrent
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="text-[10px] font-mono">0{slide.slideNumber}</div>
              <div className="text-[11px] truncate font-medium mt-0.5">
                {slide.title.split(':')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Slide Stage */}
      <div className="p-8 sm:p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-8 min-h-[520px] flex flex-col justify-between">
        <div>
          {/* Slide Kicker & Number */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
              {currentSlide.kicker}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-400">
              SLIDE 0{currentSlide.slideNumber} / 08
            </span>
          </div>

          {/* Slide Title & Summary */}
          <div className="mt-4 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {currentSlide.title}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {currentSlide.summary}
            </p>
          </div>

          {/* Key Bullet Points Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSlide.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Metrics Strip & Strategic Takeaway */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentSlide.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center"
              >
                <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  {m.value}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{m.context}</div>
              </div>
            ))}
          </div>

          {/* Strategic Takeaway Box */}
          <div className="p-4 bg-emerald-950/20 dark:bg-emerald-950/40 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-emerald-950 dark:text-emerald-200">
              <strong className="font-semibold text-emerald-800 dark:text-emerald-300 mr-2">
                Executive Takeaway:
              </strong>
              {currentSlide.strategicTakeaway}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors"
              >
                {currentSlideIndex === slides.length - 1 ? 'Start Over' : 'Next Slide'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
