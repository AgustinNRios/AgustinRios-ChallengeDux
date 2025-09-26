'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from 'primereact/button';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Captura errores de JavaScript en sus componentes hijos, registra esos errores
 * y muestra una UI de fallback en lugar de que la aplicación se rompa.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // En un entorno real, esto se enviaría a un servicio de monitoreo.
    console.error('ErrorBoundary (Error controlado):', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>
              <i className="pi pi-exclamation-triangle" />
            </div>
            
            <h2 className={styles.errorTitle}>
              ¡Oops! Algo salió mal
            </h2>
            
            <p className={styles.errorMessage}>
              ha ocurrido un error inesperado. Por favor, intenta nuevamente.
            </p>

            {/* Mostrar detalles del error solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Detalles del error (solo desarrollo)</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className={styles.errorActions}>
              <Button
                label="Intentar de nuevo"
                icon="pi pi-refresh"
                onClick={this.handleRetry}
                className="p-button-primary"
              />
              <Button
                label="Recargar la página"
                icon="pi pi-replay"
                onClick={this.handleReload}
                className="p-button-secondary"
              />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
