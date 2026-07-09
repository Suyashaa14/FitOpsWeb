import { useState } from 'react';
import Shell from '../../components/layout/Shell';
import QRCodeImage from '../../components/ui/QRCodeImage.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { downloadQrImage } from '../../lib/qr';

function getCompanyId(user) {
  const companyRef = user?.company_id || user?.company;
  return (
    user?.companyId
    || user?.companyID
    || user?.company_id
    || user?.company?._id
    || user?.company?.id
    || (companyRef && typeof companyRef === 'object' ? companyRef.id || companyRef._id : companyRef)
    || user?.company_id?._id
    || user?.company_id?.id
    || user?._id
    || user?.id
    || ''
  );
}

export default function QRRegistrationPage() {
  const { user } = useAuth();
  const toast = useToast();
  const companyId = getCompanyId(user);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const qrUrl = `${window.location.origin}/qr-register?companyId=${companyId || 'missing-company-id'}`;

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadQrImage({
        value: qrUrl,
        filename: `fitops-qr-${companyId || 'company'}.png`,
      });
      toast('QR downloaded', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">QR Client Create</h1>
            <p className="page-sub">Download or print this QR so clients can scan it and open the registration form.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="btn"
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(qrUrl);
                setCopied(true);
                toast('QR URL copied', 'success');
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? 'Copied' : 'Copy QR URL'}
            </button>
            <button className="btn btn-accent" type="button" onClick={handleDownload} disabled={downloading}>
              {downloading ? 'Downloading...' : 'Download QR'}
            </button>
          </div>
        </div>

        <div className="card" style={{ display: 'grid', placeItems: 'center', padding: 36 }}>
          <div style={{ width: '100%', maxWidth: 560, textAlign: 'center' }}>
            <span className="h-eyebrow"><span className="dot" /> PRINTABLE QR</span>
            <div style={{ margin: '24px 0' }}>
              <QRCodeImage value={qrUrl} size={260} alt="QR client create URL" />
            </div>
            <div className="mono" style={{ fontSize: 13, color: 'var(--muted)', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, wordBreak: 'break-all', marginBottom: 12 }}>
              {companyId || 'Missing company id in logged-in user token'}
            </div>
            <p style={{ margin: '0 0 14px', color: 'var(--muted)' }}>
              Put this QR at reception or print it on a poster. Scanning it opens the public client registration form directly.
            </p>
            <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', wordBreak: 'break-all' }}>
              POST /api/client/create/{companyId || ':companyId'}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
