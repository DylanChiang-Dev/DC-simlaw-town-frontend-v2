import type { VnRuntimeEvent } from './vnEventReducer';

export type TimedVnEvent = {
  event: VnRuntimeEvent;
  delayMs?: number;
};

export type VnEventQueue = {
  enqueue: (items: TimedVnEvent[]) => void;
  pause: () => void;
  resume: () => void;
  clear: () => void;
};

// 串行分发剧情事件：delayMs 表示该事件入场前的停顿；停顿期间到达的后续事件
// 排在队尾等待，保证系统提示行与后端推送的剧情顺序一致。
// pause/resume 用于等待玩家输入（如庭前调解选择框）：暂停期间事件只入队不分发。
export function createVnEventQueue(dispatch: (event: VnRuntimeEvent) => void): VnEventQueue {
  let queue: TimedVnEvent[] = [];
  let timerId: number | null = null;
  let paused = false;

  const drain = (): void => {
    if (paused) return;
    while (timerId === null && queue.length > 0) {
      const [next, ...rest] = queue;
      const delayMs = next.delayMs ?? 0;
      if (delayMs > 0) {
        timerId = window.setTimeout(() => {
          timerId = null;
          if (paused) return; // 事件留在队首，resume 后重新走停顿
          queue = queue.slice(1);
          dispatch(next.event);
          drain();
        }, delayMs);
        return;
      }
      queue = rest;
      dispatch(next.event);
    }
  };

  return {
    enqueue: (items: TimedVnEvent[]): void => {
      queue = [...queue, ...items];
      drain();
    },
    pause: (): void => {
      paused = true;
    },
    resume: (): void => {
      paused = false;
      drain();
    },
    clear: (): void => {
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
      queue = [];
      paused = false;
    },
  };
}
