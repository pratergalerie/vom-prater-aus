declare module 'scroll-timeline-polyfill/dist/scroll-timeline.js'

// ScrollTimeline API type definitions
// See: https://drafts.csswg.org/scroll-animations-1/

type ScrollAxis = 'block' | 'inline' | 'x' | 'y'

interface ScrollTimelineOptions {
  source?: Element | Document | null
  axis?: ScrollAxis
}

interface ScrollTimeline extends AnimationTimeline {
  readonly source: Element | Document | null
  readonly axis: ScrollAxis
}

declare var ScrollTimeline: {
  prototype: ScrollTimeline
  new (options?: ScrollTimelineOptions): ScrollTimeline
}
