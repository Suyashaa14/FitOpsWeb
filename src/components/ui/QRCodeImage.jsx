export default function QRCodeImage({ value, size = 220, alt = 'QR code', dark = false }) {
  const encodedValue = encodeURIComponent(value || '');
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=16&data=${encodedValue}`;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <img
        src={qrSrc}
        alt={alt}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          border: '1px solid var(--border)',
          background: 'white',
          padding: 8,
        }}
      />
      <div
        className="mono"
        style={{
          maxWidth: size,
          fontSize: 11,
          color: dark ? 'rgba(255,255,255,.6)' : 'var(--muted)',
          wordBreak: 'break-all',
          textAlign: 'center',
        }}
      >
        {value}
      </div>
    </div>
  );
}
