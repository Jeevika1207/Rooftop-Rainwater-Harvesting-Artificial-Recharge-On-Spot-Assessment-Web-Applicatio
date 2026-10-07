
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function NavigationButtons() {
  const router = useRouter();

  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft />
        <span>Previous</span>
      </Button>
      <Button variant="outline" onClick={() => router.forward()}>
        <span>Next</span>
        <ArrowRight />
      </Button>
    </div>
  );
}
