import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EventEase AI Uncaught Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-6 text-slate-800">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 font-heading">
              Something went slightly off track
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We encountered an unexpected error while preparing your event celebration data. Don't worry, your core event plans remain safe.
            </p>

            {this.state.error && (
              <div className="bg-slate-50 p-3 rounded-xl text-left text-xs font-mono text-slate-600 overflow-x-auto max-h-32 border border-slate-200">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-[#5B5CF0] hover:bg-[#494ACF] text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Reset to Clean Demo</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
