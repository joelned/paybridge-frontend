export class PerformanceMonitor {
  static mark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  }

  static measure(name: string, startMark: string, endMark?: string): void {
    if (typeof performance !== 'undefined' && performance.measure) {
      performance.measure(name, startMark, endMark);
    }
  }
}