import type { Event, Listener, } from './types'

class EventEmitter {
    listeners: Record<Event, Listener[]>;
  
    constructor() {
      this.listeners = {};
    }
  
    on(event: Event, listener: Listener) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
  
      this.listeners[event].push(listener);
    }
  
    emit(event: Event, data: any) {
      const listeners = this.listeners[event];
  
      if (!listeners) return;
  
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](data);
      }
    }
}

export default EventEmitter