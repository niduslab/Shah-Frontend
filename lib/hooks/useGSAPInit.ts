'use client';

import { useEffect } from 'react';
import { registerGSAPPlugins } from '../gsap-init';

export function useGSAPInit() {
  useEffect(() => {
    registerGSAPPlugins();
  }, []);
}
