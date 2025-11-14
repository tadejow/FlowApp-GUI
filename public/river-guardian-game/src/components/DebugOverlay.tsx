
import React from 'react';
import { DebugInfo } from '../types';

interface DebugOverlayProps {
    debugInfo: DebugInfo;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({ debugInfo }) => {
    return (
        <div className="absolute top-20 left-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg text-xs font-mono pointer-events-none z-40 border border-white/20">
            <h3 className="font-bold text-cyan-400 mb-1">DEBUG INFO</h3>
            <div><span className="text-gray-400">Phase:</span> {debugInfo.phase}</div>
            <div><span className="text-gray-400">Speed:</span> {debugInfo.speed.toFixed(2)}</div>
            <div><span className="text-gray-400">Spawn:</span> {debugInfo.spawnRate.toFixed(2)}/s</div>
            <div><span className="text-gray-400">Mix:</span> {debugInfo.mix}</div>
        </div>
    );
};
