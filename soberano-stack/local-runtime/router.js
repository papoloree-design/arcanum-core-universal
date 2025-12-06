/**
 * Router local para manejar rutas y eventos
 */

export class Router {
  constructor() {
    this.routes = new Map();
    this.middleware = [];
  }

  // Registrar ruta
  register(path, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    this.routes.set(path, handler);
  }

  // Agregar middleware
  use(middleware) {
    this.middleware.push(middleware);
  }

  // Manejar request
  async handle(path, data = {}) {
    // Ejecutar middleware
    let context = { path, data, cancel: false };

    for (const mw of this.middleware) {
      context = await mw(context);
      if (context.cancel) {
        return context.response || null;
      }
    }

    // Buscar ruta exacta
    const handler = this.routes.get(path);
    if (handler) {
      return await handler(context.data);
    }

    // Buscar ruta con wildcard
    for (const [route, handler] of this.routes) {
      if (this.matchWildcard(route, path)) {
        return await handler(context.data);
      }
    }

    // Ruta no encontrada
    throw new Error(`Route not found: ${path}`);
  }

  // Match con wildcards simples
  matchWildcard(pattern, path) {
    if (!pattern.includes('*')) {
      return pattern === path;
    }

    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*') + '$'
    );

    return regex.test(path);
  }

  // Listar rutas
  listRoutes() {
    return Array.from(this.routes.keys());
  }

  // Eliminar ruta
  unregister(path) {
    return this.routes.delete(path);
  }
}
