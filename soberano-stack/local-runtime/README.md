# Local Runtime Soberano

Motor de ejecución local sin dependencias externas.

## Componentes

### Engine
Motor de tareas asíncronas.

```javascript
import { Engine } from './local-runtime/engine.js';

const engine = new Engine();

// Tarea simple
engine.addTask(async () => {
  console.log('Task ejecutada');
});

// Tarea con delay
engine.addTask(async () => {
  console.log('Task con delay');
}, 5000);

// Tarea recurrente
engine.addInterval(async () => {
  console.log('Cada 10 segundos');
}, 10000, 'mi-interval');

// Stats
console.log(engine.stats());
```

### Router
Enrutador para eventos y comandos.

```javascript
import { Router } from './local-runtime/router.js';

const router = new Router();

// Registrar ruta
router.register('/api/health', async (data) => {
  return { status: 'ok' };
});

// Middleware
router.use(async (ctx) => {
  console.log('Request:', ctx.path);
  return ctx;
});

// Manejar
const result = await router.handle('/api/health');
```

### Scheduler
Programador de tareas cron-style.

```javascript
import { Scheduler } from './local-runtime/scheduler.js';

const scheduler = new Scheduler();

// Cada 5 minutos
scheduler.schedule('backup', '*/5 * * * *', async () => {
  console.log('Haciendo backup...');
});

// Listar
console.log(scheduler.list());
```

### Storage
Almacenamiento local key-value.

```javascript
import { LocalStorage } from './local-runtime/storage.js';

const storage = new LocalStorage();

storage.save('config', { mode: 'production' });
const config = storage.load('config');
```

## Ventajas

- ✅ Sin dependencias externas
- ✅ Eventos y tareas asíncronas
- ✅ Routing flexible
- ✅ Scheduler cron-style
- ✅ Storage persistente
