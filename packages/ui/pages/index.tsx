import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

const KERNEL_URL = process.env.NEXT_PUBLIC_KERNEL_URL;
const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_URL;

export default function Home() {
  const [kernelStatus, setKernelStatus] = useState<any>(null);
  const [identityStatus, setIdentityStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkServices();
  }, []);

  const checkServices = async () => {
    try {
      const [kernelRes, identityRes] = await Promise.all([
        axios.get(`${KERNEL_URL}/health`).catch(() => null),
        axios.get(`${IDENTITY_URL}/health`).catch(() => null)
      ]);

      setKernelStatus(kernelRes?.data);
      setIdentityStatus(identityRes?.data);
    } catch (error) {
      console.error('Error checking services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AION-Ω | Panel de Control</title>
        <meta name="description" content="Plataforma Autónoma AION-Ω" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-aion-dark via-purple-900 to-aion-dark">
        {/* Header */}
        <header className="border-b border-purple-700/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl">Ω</span>
                  AION-OMEGA
                </h1>
                <p className="text-purple-300 text-sm mt-1">Plataforma Autónoma de Infraestructura Digital</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={kernelStatus} label="Kernel" />
                <StatusBadge status={identityStatus} label="Identity" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center text-white py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4">Iniciando servicios...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Kernel Card */}
              <ServiceCard
                title="Kernel Orquestador"
                icon="🧠"
                status={kernelStatus}
                description="Orquestador central de AION"
                endpoint="/api/aion/status"
              />

              {/* Identity Card */}
              <ServiceCard
                title="Identity Service"
                icon="🆔"
                status={identityStatus}
                description="DID y Wallets MPC"
                endpoint="/api/did/list"
              />

              {/* Economy Card */}
              <ServiceCard
                title="Economy Layer"
                icon="🪙"
                status={{ status: 'ready' }}
                description="TokenFactory en Polygon"
                endpoint="Blockchain"
              />

              {/* AION-MIND Card */}
              <ServiceCard
                title="AION-MIND"
                icon="🤖"
                status={{ status: 'stub' }}
                description="Agente IA (en desarrollo)"
                endpoint="Próximamente"
              />

              {/* Edge Workers Card */}
              <ServiceCard
                title="Edge Workers"
                icon="⚡"
                status={{ status: 'ready' }}
                description="Computación distribuida"
                endpoint="Edge Layer"
              />

              {/* Deployment Info */}
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  🔗 Deployment Info
                </h3>
                <div className="space-y-3 text-sm">
                  <InfoRow label="Network" value="Polygon Mainnet" />
                  <InfoRow label="Chain ID" value="137" />
                  <InfoRow label="Deployer" value="0xdf07...5A62" />
                  <InfoRow label="Status" value="Producción" color="green" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickAction
              title="Deploy Token"
              icon="🚀"
              description="Crear nuevo token ERC20/721"
              action="/deploy"
            />
            <QuickAction
              title="Create Identity"
              icon="🆔"
              description="Generar nueva identidad DID"
              action="/identity"
            />
            <QuickAction
              title="Monitor"
              icon="📊"
              description="Ver métricas y logs"
              action="/monitor"
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-700/50 bg-black/20 backdrop-blur-sm mt-20">
          <div className="container mx-auto px-4 py-6 text-center text-purple-300 text-sm">
            <p>AION-Ω | Plataforma Autónoma | Producción v1.0.0</p>
            <p className="mt-2 text-xs text-purple-400">Polygon Mainnet | Chain ID: 137</p>
          </div>
        </footer>
      </div>
    </>
  );
}

function StatusBadge({ status, label }: { status: any; label: string }) {
  const isOnline = status?.status === 'ok';
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
      isOnline ? 'bg-green-500/20 text-green-300 border border-green-500/50' : 'bg-red-500/20 text-red-300 border border-red-500/50'
    }`}>
      <span className="inline-block w-2 h-2 rounded-full mr-2 ${
        isOnline ? 'bg-green-400' : 'bg-red-400'
      } animate-pulse"></span>
      {label}: {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}

function ServiceCard({ title, icon, status, description, endpoint }: any) {
  const isActive = status?.status === 'ok' || status?.status === 'ready';
  
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        <span className={`px-2 py-1 rounded text-xs ${
          isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
        }`}>
          {isActive ? '✅ Activo' : '🔴 Inactivo'}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-purple-300 text-sm mb-3">{description}</p>
      <div className="text-xs text-purple-400 bg-black/30 rounded px-2 py-1 font-mono">
        {endpoint}
      </div>
    </div>
  );
}

function InfoRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-purple-300">{label}:</span>
      <span className={`font-mono ${
        color === 'green' ? 'text-green-400' : 'text-white'
      }`}>{value}</span>
    </div>
  );
}

function QuickAction({ title, icon, description, action }: any) {
  return (
    <button className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 hover:scale-105 transition-all text-left group">
      <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{icon}</span>
      <h4 className="text-white font-bold mb-2">{title}</h4>
      <p className="text-purple-300 text-sm">{description}</p>
    </button>
  );
}
