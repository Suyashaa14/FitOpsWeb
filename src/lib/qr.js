export function buildQrImageUrl(value, size = 900, margin = 24) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=${margin}&data=${encodeURIComponent(value || '')}`;
}

export async function downloadQrImage({ value, filename, size = 900, margin = 24 }) {
  const qrUrl = buildQrImageUrl(value, size, margin);
  const response = await fetch(qrUrl);
  if (!response.ok) {
    throw new Error('Unable to download QR image');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
