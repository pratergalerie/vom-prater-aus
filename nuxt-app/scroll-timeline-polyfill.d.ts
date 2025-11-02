declare module 'scroll-timeline-polyfill/dist/scroll-timeline.js'

type ScrollAxis = 'block' | 'inline' | 'x' | 'y'

interface ViewTimelineOptions {
  subject: Element
  axis?: ScrollAxis
}

interface ViewTimeline extends AnimationTimeline {
  readonly subject: Element
  readonly axis: ScrollAxis
}

declare const ViewTimeline: {
  prototype: ViewTimeline
  new (options: ViewTimelineOptions): ViewTimeline
}

// Extended KeyframeAnimationOptions to support scroll-driven animations
interface KeyframeAnimationOptions extends EffectTiming {
  timeline?: AnimationTimeline
  rangeStart?: string
  rangeEnd?: string
}
