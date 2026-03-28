import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocurrió un error inesperado';

      if (error.status === 0) {
        message = 'No se puede conectar con el servidor. ¿El backend está corriendo?';
      } else if (error.status === 404) {
        message = 'Recurso no encontrado';
      } else if (error.status === 400) {
        message = error.error?.message || 'Datos inválidos';
      } else if (error.status === 500) {
        message = 'Error interno del servidor';
      }

      // Acá podés inyectar un ToastService cuando lo tengas
      console.error(`[HTTP ${error.status}] ${message}`, error);

      return throwError(() => ({ ...error, userMessage: message }));
    })
  );
};
