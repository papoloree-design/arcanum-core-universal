/**
 * Scheduler para tareas programadas
 */

export class Scheduler {
  constructor() {
    this.jobs = new Map();
  }

  // Programar tarea
  schedule(name, cronExpression, fn) {
    const job = {
      name,
      cron: cronExpression,
      fn,
      lastRun: null,
      nextRun: this.calculateNextRun(cronExpression),
      runs: 0
    };

    this.jobs.set(name, job);
    this.startJob(name);

    return name;
  }

  // Iniciar job
  startJob(name) {
    const job = this.jobs.get(name);
    if (!job) return;

    const delay = job.nextRun - Date.now();

    if (delay > 0) {
      job.timeout = setTimeout(() => {
        this.runJob(name);
      }, delay);
    }
  }

  // Ejecutar job
  async runJob(name) {
    const job = this.jobs.get(name);
    if (!job) return;

    job.lastRun = Date.now();
    job.runs++;

    try {
      await job.fn();
    } catch (error) {
      console.error(`Job ${name} failed:`, error);
    }

    // Programar siguiente ejecución
    job.nextRun = this.calculateNextRun(job.cron);
    this.startJob(name);
  }

  // Detener job
  stop(name) {
    const job = this.jobs.get(name);
    if (job && job.timeout) {
      clearTimeout(job.timeout);
      return true;
    }
    return false;
  }

  // Cancelar job
  cancel(name) {
    this.stop(name);
    return this.jobs.delete(name);
  }

  // Calcular próxima ejecución (simplificado)
  calculateNextRun(cronExpression) {
    // Parsear expresión cron simple
    // Formato: "*/5 * * * *" (cada 5 minutos)
    // Por ahora, calcular basado en minutos

    const parts = cronExpression.split(' ');
    const minutes = parts[0];

    if (minutes.startsWith('*/')) {
      const interval = parseInt(minutes.slice(2));
      return Date.now() + (interval * 60 * 1000);
    }

    // Default: 1 hora
    return Date.now() + (60 * 60 * 1000);
  }

  // Listar jobs
  list() {
    return Array.from(this.jobs.values()).map(job => ({
      name: job.name,
      cron: job.cron,
      lastRun: job.lastRun,
      nextRun: job.nextRun,
      runs: job.runs
    }));
  }
}
