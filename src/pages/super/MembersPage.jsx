import Shell from '../../components/layout/Shell';
import { Avatar, StatusBadge, I } from '../../components/ui/index.jsx';
import { MOCK_MEMBERS, MOCK_GYMS } from '../../data/mockData';

export default function SuperMembers() {
  return (
    <Shell role="super">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">All Members</h1>
            <p className="page-sub">Platform-wide member directory — read-only</p>
          </div>
          <button className="btn">{I.download} Export</button>
        </div>
        <div className="card card-flush">
          <table className="table">
            <thead>
              <tr><th>Member</th><th>Phone</th><th>Gym</th><th>Package</th><th>Status</th><th>Expiry</th></tr>
            </thead>
            <tbody>
              {MOCK_MEMBERS.slice(0, 14).map((m, i) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Avatar name={m.name} size="sm" />
                      <strong>{m.name}</strong>
                    </div>
                  </td>
                  <td className="mono">{m.phone}</td>
                  <td>{MOCK_GYMS[i % MOCK_GYMS.length].name}</td>
                  <td><span className="chip">{m.package}</span></td>
                  <td><StatusBadge status={m.status} /></td>
                  <td className="mono">{m.expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
