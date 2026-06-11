import React from 'react';
import { Skeleton } from './Skeleton';

export function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      background: 'var(--clr-surface, rgba(255,255,255,0.04))',
      border: '1px solid var(--clr-border, rgba(255,255,255,0.07))',
    }}>
      <Skeleton height={220} radius={0} />
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton height={20} width="68%" />
        <Skeleton height={13} width="42%" />
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <Skeleton height={34} />
          <Skeleton height={34} width={80} />
        </div>
      </div>
    </div>
  );
}

interface GridProps {
  count?: number;
  columns?: string;
}

export function SkeletonCardGrid({ count = 6, columns = 'repeat(auto-fill, minmax(300px, 1fr))' }: GridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 20 }}>
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonDetailPage() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Skeleton height={380} radius={14} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton height={36} width="55%" />
        <Skeleton height={16} width="30%" />
        <Skeleton height={14} />
        <Skeleton height={14} width="88%" />
        <Skeleton height={14} width="72%" />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Skeleton height={48} />
        <Skeleton height={48} width={140} />
      </div>
    </div>
  );
}
