import { EventEmitter } from 'events';

/**
 * Motor de ejecución local
 * Ejecuta tareas sin dependencias externas
 */

export class Engine extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
    this.running = false;
    this.intervals = new Map();
  }

  // Agregar tarea
  addTask(fn, delay = 0, priority = 0) {
    const task = {
      id: this.generateTaskId(),
      fn,
      delay,
      priority,
      status: 'pending',
      createdAt: Date.now()
    };

    this.tasks.push(task);
    this.tasks.sort((a, b) => b.priority - a.priority);

    if (delay > 0) {
      setTimeout(() => this.executeTask(task), delay);
    } else {
      this.executeTask(task);
    }

    return task.id;
  }

  // Ejecutar tarea
  async executeTask(task) {
    task.status = 'running';
    task.startedAt = Date.now();

    this.emit('task:start', task);

    try {
      const result = await task.fn();
      task.status = 'completed';
      task.result = result;
      task.completedAt = Date.now();
      this.emit('task:complete', task);
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      task.failedAt = Date.now();
      this.emit('task:error', { task, error });
    }

    return task;
  }

  // Tarea recurrente
  addInterval(fn, interval, name = null) {
    const id = name || this.generateTaskId();
    
    const intervalId = setInterval(async () => {
      try {
        await fn();
        this.emit('interval:tick', { id, time: Date.now() });
      } catch (error) {
        this.emit('interval:error', { id, error });
      }
    }, interval);

    this.intervals.set(id, intervalId);
    return id;
  }

  // Detener interval
  clearInterval(id) {
    const intervalId = this.intervals.get(id);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(id);
      return true;
    }
    return false;
  }

  // Ejecutar todas las tareas pendientes
  async run() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.emit('engine:start');

    const pendingTasks = this.tasks.filter(t => t.status === 'pending');

    for (const task of pendingTasks) {
      await this.executeTask(task);
    }

    this.running = false;
    this.emit('engine:complete');
  }

  // Obtener estadísticas
  stats() {
    return {
      total: this.tasks.length,
      pending: this.tasks.filter(t => t.status === 'pending').length,
      running: this.tasks.filter(t => t.status === 'running').length,
      completed: this.tasks.filter(t => t.status === 'completed').length,
      failed: this.tasks.filter(t => t.status === 'failed').length,
      intervals: this.intervals.size
    };
  }

  // Limpiar tareas completadas
  cleanup() {
    this.tasks = this.tasks.filter(t => 
      t.status === 'pending' || t.status === 'running'
    );
  }

  generateTaskId() {
    return `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
