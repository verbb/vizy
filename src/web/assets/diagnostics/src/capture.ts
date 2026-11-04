import { installCapture, type CaptureConfig } from './browser-capture';

const script = document.currentScript;
if (script instanceof HTMLScriptElement && script.dataset.vizyDiagnostics) {
    installCapture(JSON.parse(script.dataset.vizyDiagnostics) as CaptureConfig);
}
