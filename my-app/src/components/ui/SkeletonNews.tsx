import { Skeleton } from './Skeleton';

export function SkeletonNewsCard() {
  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      background: 'var(--clr-surface, rgba(255,255,255,0.04))',
      border: '1px solid var(--clr-border, rgba(255,255,255,0.07))',
    }}>
      <Skeleton height={180} borderRadius={0} />
      <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton height={10} width="28%" />
        <Skeleton height={18} width="78%" />
        <Skeleton height={13} />
        <Skeleton height={13} width="66%" />
        <Skeleton height={36} style={{ marginTop: 6 }} borderRadius={8} />
      </div>
    </div>
  );
}

export function SkeletonNewsGrid({ count = 6, columns = 'repeat(auto-fill, minmax(280px, 1fr))' }: { count?: number; columns?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 20 }}>
      {Array.from({ length: count }, (_, i) => <SkeletonNewsCard key={i} />)}
    </div>
  );
}

export function SkeletonAdminTable({ rows = 8 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 100px',
        gap: 16,
        padding: '10px 16px',
        borderBottom: '1px solid var(--clr-border, rgba(255,255,255,0.07))',
      }}>
        {[42, 60, 50, 55, 36].map((w, i) => (
          <Skeleton key={i} height={12} width={`${w}%`} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 100px',
          gap: 16,
          padding: '12px 16px',
          borderBottom: '1px solid var(--clr-border, rgba(255,255,255,0.04))',
        }}>
          {[70, 55, 45, 60, 40].map((w, j) => (
            <Skeleton key={j} height={14} width={`${w}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}
