import { createHook, executionAsyncId } from 'node:async_hooks';

const storeContext = new Map();

createHook({
  init: (asyncId: number, _: string, triggerAsyncId: number) => {
    if (storeContext.has(triggerAsyncId)) {
      storeContext.set(asyncId, storeContext.get(triggerAsyncId));
    }
  },
  destroy: (asyncId: number) => {
    if (storeContext.has(asyncId)) {
      storeContext.delete(asyncId);
    }
  },
}).enable();

export class TracerContextAudit {
  public static setContextTracerId(tracerId: string): void {
    storeContext.set(executionAsyncId(), tracerId);
  }

  public static getContextTracerId(): string {
    return storeContext.get(executionAsyncId());
  }
}
