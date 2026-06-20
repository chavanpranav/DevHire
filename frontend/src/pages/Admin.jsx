import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V11h6v10"/>
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12}}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12}}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,marginRight:6}}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconWarning = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36,color:"#ef4444"}}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16,flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const BASE_URL = "http://localhost:8080";

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`admin-toast ${type}`}>
      <IconInfo />
      <span>{message}</span>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({ company, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
          <IconWarning />
          <div>
            <h3>Delete Company</h3>
            <p>
              Are you sure you want to delete <strong>{company.name}</strong>? This will also remove
              the linked user account. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="admin-modal-actions">
          <button className="admin-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="admin-modal-confirm" onClick={onConfirm}>Delete Company</button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color, bg, loading }) {
  return (
    <div className="admin-stat-card" style={{ "--stat-color": color, "--stat-bg": bg }}>
      <div className="admin-stat-icon">{icon}</div>
      <div className="admin-stat-info">
        <h3>{loading ? "—" : value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

// ─── Companies Table ──────────────────────────────────────────────────────────

function CompaniesView({ token, onToast }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | verified | unverified
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/company/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCompanies(data.companies);
      else onToast("Failed to load companies.", "error");
    } catch {
      onToast("Network error. Is the server running?", "error");
    } finally {
      setLoading(false);
    }
  }, [token, onToast]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const handleVerifyToggle = async (company) => {
    setActionLoading(company._id + "_verify");
    try {
      const res = await fetch(`${BASE_URL}/api/company/${company._id}/verify`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCompanies((prev) =>
          prev.map((c) => (c._id === company._id ? data.company : c))
        );
        onToast(data.message, "success");
      } else {
        onToast("Failed to update verification.", "error");
      }
    } catch {
      onToast("Network error.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirm = async () => {
    const company = confirmDelete;
    setConfirmDelete(null);
    setActionLoading(company._id + "_delete");
    try {
      const res = await fetch(`${BASE_URL}/api/company/${company._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCompanies((prev) => prev.filter((c) => c._id !== company._id));
        onToast(`"${company.name}" deleted successfully.`, "success");
      } else {
        onToast("Failed to delete company.", "error");
      }
    } catch {
      onToast("Network error.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.user?.email || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "verified") return matchSearch && c.isVerified;
    if (filter === "unverified") return matchSearch && !c.isVerified;
    return matchSearch;
  });

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

  return (
    <>
      {confirmDelete && (
        <ConfirmModal
          company={confirmDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="admin-header">
        <h1>Company Management</h1>
        <p>View, verify, and manage all registered companies on the platform.</p>
      </div>

      <div className="admin-section">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <IconSearch />
            <input
              id="admin-company-search"
              className="admin-search-input"
              type="text"
              placeholder="Search by company name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-filter-tabs">
            {["all", "verified", "unverified"].map((f) => (
              <button
                key={f}
                id={`admin-filter-${f}`}
                className={`admin-filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span style={{ marginLeft: 6, opacity: 0.65 }}>
                  ({f === "all"
                    ? companies.length
                    : f === "verified"
                    ? companies.filter((c) => c.isVerified).length
                    : companies.filter((c) => !c.isVerified).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            Loading companies…
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <IconBuilding />
            <p>{search ? "No companies match your search." : "No companies registered yet."}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((company) => {
                  const isVerifyLoading = actionLoading === company._id + "_verify";
                  const isDeleteLoading = actionLoading === company._id + "_delete";
                  return (
                    <tr key={company._id}>
                      {/* Company */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 700, fontSize: "0.9rem"
                          }}>
                            {company.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="admin-company-name">{company.name}</div>
                            {company.website && (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-company-meta"
                                style={{ color: "var(--admin-accent)", textDecoration: "none" }}
                              >
                                {company.website}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Owner */}
                      <td>
                        <div className="admin-company-name" style={{ fontSize: "0.875rem" }}>
                          {company.user?.name || "—"}
                        </div>
                        <div className="admin-company-meta">{company.user?.email || "—"}</div>
                      </td>
                      {/* Location */}
                      <td style={{ color: "var(--admin-muted)" }}>
                        {company.location || <span style={{ opacity: 0.4 }}>Not set</span>}
                      </td>
                      {/* Status */}
                      <td>
                        <span className={`admin-badge ${company.isVerified ? "verified" : "unverified"}`}>
                          <span className="admin-badge-dot" />
                          {company.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      {/* Date */}
                      <td style={{ color: "var(--admin-muted)", fontSize: "0.82rem" }}>
                        {formatDate(company.createdAt)}
                      </td>
                      {/* Actions */}
                      <td>
                        <div className="admin-actions">
                          <button
                            id={`btn-verify-${company._id}`}
                            className={`admin-btn ${company.isVerified ? "unverify" : "verify"}`}
                            onClick={() => handleVerifyToggle(company)}
                            disabled={isVerifyLoading || isDeleteLoading}
                          >
                            {isVerifyLoading ? (
                              <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid currentColor", borderTopColor: "transparent", display: "inline-block", animation: "admin-spin 0.6s linear infinite" }} />
                            ) : company.isVerified ? <IconX /> : <IconCheck />}
                            {company.isVerified ? "Unverify" : "Verify"}
                          </button>
                          <button
                            id={`btn-delete-${company._id}`}
                            className="admin-btn delete"
                            onClick={() => setConfirmDelete(company)}
                            disabled={isVerifyLoading || isDeleteLoading}
                          >
                            {isDeleteLoading ? (
                              <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid currentColor", borderTopColor: "transparent", display: "inline-block", animation: "admin-spin 0.6s linear infinite" }} />
                            ) : <IconTrash />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashboardView({ token, onToast, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [statsRes, companiesRes] = await Promise.all([
          fetch(`${BASE_URL}/api/company/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/company/all`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const statsData = await statsRes.json();
        const companiesData = await companiesRes.json();
        if (statsData.success) setStats(statsData.stats);
        if (companiesData.success) setRecent(companiesData.companies.slice(0, 5));
      } catch {
        onToast("Failed to load dashboard data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token, onToast]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
        <p>A quick look at the state of companies on DevHire.</p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        <StatCard
          label="Total Companies"
          value={stats?.total}
          loading={loading}
          color="#6366f1"
          bg="rgba(99,102,241,0.10)"
          icon={<IconBuilding />}
        />
        <StatCard
          label="Verified"
          value={stats?.verified}
          loading={loading}
          color="#10b981"
          bg="rgba(16,185,129,0.10)"
          icon={<IconShield />}
        />
        <StatCard
          label="Pending Verification"
          value={stats?.unverified}
          loading={loading}
          color="#f59e0b"
          bg="rgba(245,158,11,0.10)"
          icon={<IconClock />}
        />
      </div>

      {/* Recent Companies */}
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>Recently Registered Companies</h2>
            <p>Latest 5 companies that joined the platform</p>
          </div>
          <button
            id="btn-view-all-companies"
            onClick={() => onNavigate("companies")}
            style={{
              padding: "0.5rem 1rem", background: "var(--admin-accent-light)",
              color: "var(--admin-accent)", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", transition: "background 0.15s"
            }}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /> Loading…</div>
        ) : recent.length === 0 ? (
          <div className="admin-empty">
            <IconBuilding />
            <p>No companies registered yet.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Owner Email</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontWeight: 700, fontSize: "0.85rem"
                        }}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="admin-company-name">{c.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--admin-muted)", fontSize: "0.875rem" }}>{c.user?.email || "—"}</td>
                    <td>
                      <span className={`admin-badge ${c.isVerified ? "verified" : "unverified"}`}>
                        <span className="admin-badge-dot" />
                        {c.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td style={{ color: "var(--admin-muted)", fontSize: "0.82rem" }}>{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────

function Admin() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <IconGrid /> },
    { key: "companies", label: "Companies", icon: <IconBuilding /> },
  ];

  return (
    <div className="admin-layout">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>DevHire</h2>
          <span>Admin Console</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              id={`admin-nav-${item.key}`}
              className={`admin-nav-item ${activeView === item.key ? "active" : ""}`}
              onClick={() => setActiveView(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">{initials}</div>
            <div className="admin-user-info">
              <p>{user?.name || "Admin"}</p>
              <span>{user?.role || "ADMIN"}</span>
            </div>
          </div>
          <button id="admin-logout-btn" className="admin-logout-btn" onClick={handleLogout}>
            <IconLogout />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">
        {activeView === "dashboard" && (
          <DashboardView token={user?.token} onToast={showToast} onNavigate={setActiveView} />
        )}
        {activeView === "companies" && (
          <CompaniesView token={user?.token} onToast={showToast} />
        )}
      </main>

      {/* ── Toast ── */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Admin;