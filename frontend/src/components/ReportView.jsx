import React, { useState } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, Clock, FileText, Search, Star, AlignLeft, Layers
} from 'lucide-react';
import DocumentPaperView from './DocumentPaperView';

const MatchDetail = ({ match }) => {
  return (
    <div className="lc-match-card">
      <div className="lc-match-header">
        <span className="lc-match-rank">#{match.rank}</span>
        <span className="lc-match-title">{match.section_title_b || `Đoạn ${match.target_clause_no}`}</span>
        <span className="lc-match-score">Score: {match.score.toFixed(4)}</span>
      </div>
      <div className="lc-match-body">
        {match.content_b}
      </div>
    </div>
  );
};

const RetrievalDetailRow = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`lc-clause ${expanded ? 'lc-clause-open' : ''}`}>
      <div className="lc-clause-header" onClick={() => setExpanded(e => !e)}>
        <span className="lc-clause-num">{index}</span>
        <div className="lc-clause-meta">
          <span className="lc-clause-title">{item.section_title_a || `Đoạn ${item.source_clause_no}`}</span>
          <div className="lc-clause-badges">
            <span className="lc-badge lc-badge-blue">
              <Search size={11} /> {item.matches.length} kết quả
            </span>
          </div>
        </div>
        <span className="lc-clause-chevron">
          {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </span>
      </div>

      {expanded && (
        <div className="lc-clause-body">
          <div className="lc-source-content">
            <strong>Nội dung gốc (File A):</strong>
            <div className="lc-source-text">{item.content_a}</div>
          </div>

          <div className="lc-matches-container">
            <strong className="lc-matches-title"><Layers size={14} style={{display: 'inline', marginRight: '4px'}}/> Các kết quả truy xuất & Reranking từ File B:</strong>
            {item.matches.length > 0 ? (
              <div className="lc-matches-list">
                {item.matches.map((match, i) => (
                  <MatchDetail key={i} match={match} />
                ))}
              </div>
            ) : (
              <em style={{ color: '#94a3b8' }}>Không có kết quả phù hợp.</em>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, variant }) => {
  const palette = {
    blue:   { bg: '#eff6ff', border: '#bfdbfe', val: '#1d4ed8' },
    green:  { bg: '#f0fdf4', border: '#bbf7d0', val: '#16a34a' },
  };
  const c = palette[variant] || palette.blue;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '0.875rem', padding: '1.25rem 1.5rem' }}>
      <p style={{ font: '600 0.72rem/1 Segoe UI,sans-serif', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>{title}</p>
      <p style={{ font: `800 2.25rem/1 Segoe UI,sans-serif`, color: c.val }}>{value}</p>
    </div>
  );
};

const ReportView = ({ data, onReset }) => {
  const { report, duration_sec, pdf_url_a, pdf_url_b } = data;
  const { summary, details } = report;

  return (
    <div className="lc-report">
      {}
      <div className="lc-report-topbar">
        <div>
          <h2 className="lc-report-title">Minh họa Semantic Matching (Hybrid + Rerank)</h2>
          <span className="lc-report-time"><Clock size={13} /> Phân tích hoàn tất trong {duration_sec}s</span>
        </div>
        <button className="lc-back-btn" onClick={onReset}>
          <ArrowLeft size={16} /> Quay lại
        </button>
      </div>

      {}
      <div className="lc-stats-grid lc-section">
        <StatCard title="Tổng đoạn truy vấn (File A)" value={summary.total_clauses_compared} variant="blue" />
        <StatCard title="Tổng đoạn đích (File B)" value={summary.total_targets} variant="green" />
      </div>

      {}
      <div className="lc-section lc-report-card">
        <div className="lc-report-card-header">
          <FileText size={18} />
          <h3>Chi tiết truy xuất từng đoạn</h3>
          <span className="lc-count-badge">{details.length} mục</span>
        </div>
        <div className="lc-clauses-list">
          {details.map((item, i) => (
            <RetrievalDetailRow key={i} item={item} index={i + 1} />
          ))}
        </div>
      </div>

      <style>{`
        .lc-report { display: flex; flex-direction: column; gap: 0; }

        .lc-report-topbar {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
        }
        .lc-report-title { font-size: 1.6rem; font-weight: 800; color: #0f2545; margin: 0 0 0.25rem; }
        .lc-report-time { display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: #64748b; }
        .lc-back-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.6rem 1.25rem; border-radius: 9999px;
          background: #fff; border: 1.5px solid #bfdbfe; color: #1d4ed8;
          font-size: 0.88rem; font-weight: 700; cursor: pointer;
          transition: all 0.15s;
        }
        .lc-back-btn:hover { background: #eff6ff; }

        .lc-section { margin-bottom: 1.75rem; }

        .lc-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }

        .lc-report-card {
          background: #fff; border: 1px solid #dbeafe;
          border-radius: 1.25rem; overflow: hidden;
          box-shadow: 0 2px 12px rgba(30,64,175,.06);
        }
        .lc-report-card-header {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 1.25rem 1.5rem;
          background: linear-gradient(135deg,#eff6ff,#f0f9ff);
          border-bottom: 1px solid #dbeafe; color: #1d4ed8;
        }
        .lc-report-card-header h3 { font-size: 1.05rem; font-weight: 700; color: #0f2545; margin: 0; }
        .lc-count-badge {
          margin-left: auto; background: #dbeafe; color: #1d4ed8;
          font-size: 0.78rem; font-weight: 700; padding: 0.2rem 0.65rem;
          border-radius: 20px;
        }
        .lc-clauses-list { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }

        .lc-clause {
          border: 1px solid #e2e8f0; border-radius: 0.875rem;
          overflow: hidden; background: #fff; transition: box-shadow 0.2s;
        }
        .lc-clause-open { box-shadow: 0 4px 20px rgba(30,64,175,.1); border-color: #bfdbfe; }
        .lc-clause-header {
          display: flex; align-items: center; gap: 0.875rem;
          padding: 1rem 1.25rem; cursor: pointer;
          transition: background 0.15s;
        }
        .lc-clause-header:hover { background: #f8fbff; }
        .lc-clause-num {
          width: 26px; height: 26px; border-radius: 50%;
          background: #eff6ff; color: #1d4ed8;
          font-size: 0.78rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lc-clause-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.35rem; }
        .lc-clause-title { font-size: 0.95rem; font-weight: 600; color: #0f2545; }
        .lc-clause-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .lc-clause-chevron { color: #94a3b8; flex-shrink: 0; }

        .lc-badge {
          display: inline-flex; align-items: center; gap: 0.3rem;
          font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }
        .lc-badge-blue  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

        .lc-clause-body { 
          padding: 1.25rem 1.5rem; 
          border-top: 1px solid #dbeafe; 
          background: #f8fbff; 
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          align-items: start;
        }

        .lc-source-content {
          background: #fff; border: 1px solid #dbeafe;
          border-radius: 0.6rem; padding: 1rem;
        }
        .lc-source-text {
          margin-top: 0.5rem; font-size: 0.9rem; color: #334155; line-height: 1.6;
          white-space: pre-wrap; padding-left: 0.5rem; border-left: 3px solid #1d4ed8;
        }

        .lc-matches-container {
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .lc-matches-title { font-size: 0.95rem; color: #0f2545; margin-bottom: 0.25rem; }
        .lc-matches-list {
          display: flex; flex-direction: column; gap: 0.75rem;
        }

        .lc-match-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 0.6rem; overflow: hidden;
        }
        .lc-match-header {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1rem; background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .lc-match-rank {
          background: #1d4ed8; color: #fff; font-size: 0.75rem; font-weight: 800;
          padding: 0.15rem 0.5rem; border-radius: 4px;
        }
        .lc-match-title { font-size: 0.85rem; font-weight: 600; color: #334155; flex: 1; }
        .lc-match-score {
          font-size: 0.8rem; font-weight: 700; color: #0ea5e9;
          background: #e0f2fe; padding: 0.2rem 0.6rem; border-radius: 20px;
        }
        .lc-match-body {
          padding: 1rem; font-size: 0.88rem; color: #475569;
          line-height: 1.6; white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default ReportView;
