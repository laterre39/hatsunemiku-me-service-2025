'use client';

import { useEffect } from 'react';

export function FlowbiteClient() {
  useEffect(() => {
    import('flowbite');
  }, []);

  return null;
}
