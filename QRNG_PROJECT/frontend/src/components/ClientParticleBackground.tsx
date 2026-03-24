'use client';

import dynamic from 'next/dynamic';

export const ClientParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false,
});
