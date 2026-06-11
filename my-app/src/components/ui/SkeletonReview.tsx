import { Skeleton } from './Skeleton';

export function SkeletonReview() {
  return (
    <div style={{
      padding: '20px 24px',
      borderRadius: 14,
      background: 'var(--clr-surface, rgba(255,255,255,0.03))',
      border: '1px solid var(--clr-border, rgba(255,255,255,0.07))',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton width={44} height={44} borderRadius="50%" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton height={14} width="38%" />
          <Skeleton height={11} width="22%" />
        </div>
        <Skeleton height={14} width={64} />
      </div>
      <Skeleton height={13} />
      <Skeleton height={13} width="82%" />
      <Skeleton height={13} width="58%" />
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <Skeleton height={28} width={60} />
        <Skeleton height={28} width={60} />
      </div>
    </div>
  );
}

export function SkeletonReviewGrid({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Array.from({ length: count }, (_, i) => <SkeletonReview key={i} />)}
    </div>
  );
}
