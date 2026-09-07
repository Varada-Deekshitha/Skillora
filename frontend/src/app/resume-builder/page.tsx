"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ResumeData {
  name: string; title: string; email: string; phone: string;
  location: string; linkedin: string; github: string; summary: string;
  experience: { company: string; role: string; duration: string; points: string }[];
  education:  { institution: string; degree: string; year: string; gpa: string }[];
  skills: string;
  projects: { name: string; tech: string; desc: string }[];
  certifications: string;
}

// Default is completely empty — user fills everything
const EMPTY: ResumeData = {
  name: "", title: "", email: "", phone: "",
  location: "", linkedin: "", github: "", summary: "",
  experience: [{ company: "", role: "", duration: "", points: "" }],
  education:  [{ institution: "", degree: "", year: "", gpa: "" }],
  skills: "",
  projects: [{ name: "", tech: "", desc: "" }],
  certifications: "",
};

// ── 10 Layout Templates ────────────────────────────────────────────────────────
// Each template has a distinct LAYOUT, not just color
type TplId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const TEMPLATES: { id: TplId; name: string; preview: string; desc: string }[] = [
  { id: 1,  name: "Classic",     preview: "📄", desc: "Traditional single-column with ruled sections" },
  { id: 2,  name: "Modern",      preview: "🔲", desc: "Clean two-column sidebar layout" },
  { id: 3,  name: "Minimal",     preview: "⬜", desc: "Ultra-clean, lots of whitespace" },
  { id: 4,  name: "Executive",   preview: "🏛️", desc: "Header banner, formal corporate style" },
  { id: 5,  name: "Timeline",    preview: "📅", desc: "Left timeline line for experience" },
  { id: 6,  name: "Tech",        preview: "💻", desc: "Dark header, monospace accents" },
  { id: 7,  name: "Creative",    preview: "🎨", desc: "Bold left color stripe sidebar" },
  { id: 8,  name: "Compact",     preview: "📋", desc: "Dense layout, fits more on one page" },
  { id: 9,  name: "Elegant",     preview: "✨", desc: "Centered header, serif fonts" },
  { id: 10, name: "ATS Safe",    preview: "🤖", desc: "Plain text-only, best ATS score" },
];

// ── Template Renderers ─────────────────────────────────────────────────────────
function ResumePreview({ data, tplId }: { data: ResumeData; tplId: TplId }) {
  switch (tplId) {
    case 1:  return <ClassicLayout   data={data} />;
    case 2:  return <ModernLayout    data={data} />;
    case 3:  return <MinimalLayout   data={data} />;
    case 4:  return <ExecutiveLayout data={data} />;
    case 5:  return <TimelineLayout  data={data} />;
    case 6:  return <TechLayout      data={data} />;
    case 7:  return <CreativeLayout  data={data} />;
    case 8:  return <CompactLayout   data={data} />;
    case 9:  return <ElegantLayout   data={data} />;
    case 10: return <ATSLayout       data={data} />;
    default: return <ClassicLayout   data={data} />;
  }
}

// ── 1. Classic ─────────────────────────────────────────────────────────────────
function ClassicLayout({ data }: { data: ResumeData }) {
  const s: React.CSSProperties = { fontFamily: "Georgia, serif", fontSize: 13, color: "#1a1a1a", lineHeight: 1.6, padding: "36px 40px", background: "#fff" };
  return (
    <div style={s}>
      <div style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 1 }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{data.title || "Professional Title"}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 6, fontSize: 11, color: "#666" }}>
          {data.email    && <span>{data.email}</span>}
          {data.phone    && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.github   && <span>{data.github}</span>}
        </div>
      </div>
      <CLSec title="Summary">{data.summary && <p style={{ color: "#444", margin: 0 }}>{data.summary}</p>}</CLSec>
      <CLSec title="Experience">
        {data.experience.filter(e => e.company).map((e, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{e.role}</b><span style={{ fontSize: 11, color: "#777" }}>{e.duration}</span>
            </div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 3 }}>{e.company}</div>
            {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 12, paddingLeft: 12, color: "#555" }}>• {pt}</div>)}
          </div>
        ))}
      </CLSec>
      <CLSec title="Education">
        {data.education.filter(e => e.institution).map((e, i) => (
          <div key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <div><b>{e.degree}</b><div style={{ fontSize: 12, color: "#666" }}>{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</div></div>
            <span style={{ fontSize: 11, color: "#777" }}>{e.year}</span>
          </div>
        ))}
      </CLSec>
      <CLSec title="Skills">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.skills.split(",").map(s => s.trim()).filter(Boolean).map((sk, i) => (
            <span key={i} style={{ border: "1px solid #ccc", borderRadius: 3, padding: "1px 8px", fontSize: 11 }}>{sk}</span>
          ))}
        </div>
      </CLSec>
      <CLSec title="Projects">
        {data.projects.filter(p => p.name).map((p, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{p.name}</b>{p.tech && <span style={{ fontSize: 11, color: "#666" }}> · {p.tech}</span>}
            {p.desc && <div style={{ fontSize: 12, color: "#555" }}>{p.desc}</div>}
          </div>
        ))}
      </CLSec>
      {data.certifications && <CLSec title="Certifications">{data.certifications.split("\n").filter(Boolean).map((c, i) => <div key={i} style={{ fontSize: 12, color: "#555" }}>• {c}</div>)}</CLSec>}
    </div>
  );
}
function CLSec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, borderBottom: "1px solid #ccc", paddingBottom: 3, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

// ── 2. Modern (2-column sidebar) ───────────────────────────────────────────────
function ModernLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", minHeight: 900, fontSize: 12, background: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: "#1e293b", color: "#e2e8f0", padding: "28px 18px", flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 20 }}>{data.title}</div>
        <SBSec title="Contact">
          {data.email    && <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>{data.email}</div>}
          {data.phone    && <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>{data.phone}</div>}
          {data.location && <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>{data.location}</div>}
          {data.linkedin && <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>{data.linkedin}</div>}
          {data.github   && <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>{data.github}</div>}
        </SBSec>
        <SBSec title="Skills">
          {data.skills.split(",").map(s => s.trim()).filter(Boolean).map((sk, i) => (
            <div key={i} style={{ fontSize: 10, color: "#cbd5e1", marginBottom: 4, paddingLeft: 8, borderLeft: "2px solid #3b82f6" }}>{sk}</div>
          ))}
        </SBSec>
        {data.certifications && (
          <SBSec title="Certs">
            {data.certifications.split("\n").filter(Boolean).map((c, i) => <div key={i} style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>• {c}</div>)}
          </SBSec>
        )}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: "28px 24px" }}>
        {data.summary && <><div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>About</div><p style={{ color: "#374151", marginBottom: 16, lineHeight: 1.6 }}>{data.summary}</p></>}
        {data.experience.some(e => e.company) && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Experience</div>
          {data.experience.filter(e => e.company).map((e, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ color: "#111" }}>{e.role}</b><span style={{ fontSize: 10, color: "#9ca3af" }}>{e.duration}</span></div>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>{e.company}</div>
              {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 11, paddingLeft: 10, color: "#4b5563" }}>• {pt}</div>)}
            </div>
          ))}
        </>}
        {data.education.some(e => e.institution) && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, marginTop: 16 }}>Education</div>
          {data.education.filter(e => e.institution).map((e, i) => (
            <div key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <div><b style={{ color: "#111" }}>{e.degree}</b><div style={{ fontSize: 11, color: "#6b7280" }}>{e.institution}{e.gpa ? ` · ${e.gpa}` : ""}</div></div>
              <span style={{ fontSize: 10, color: "#9ca3af" }}>{e.year}</span>
            </div>
          ))}
        </>}
        {data.projects.some(p => p.name) && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, marginTop: 16 }}>Projects</div>
          {data.projects.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}><b style={{ color: "#111" }}>{p.name}</b>{p.tech && <span style={{ fontSize: 10, color: "#6b7280" }}> · {p.tech}</span>}{p.desc && <div style={{ fontSize: 11, color: "#4b5563" }}>{p.desc}</div>}</div>
          ))}
        </>}
      </div>
    </div>
  );
}
function SBSec({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 18 }}><div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#64748b", marginBottom: 6 }}>{title}</div>{children}</div>;
}

// ── 3. Minimal ─────────────────────────────────────────────────────────────────
function MinimalLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: 12, color: "#111", padding: "48px 52px", background: "#fff", lineHeight: 1.7 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>{data.name || "Your Name"}</div>
        {data.title && <div style={{ fontSize: 14, color: "#666", marginTop: 2 }}>{data.title}</div>}
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "#888", flexWrap: "wrap" }}>
          {[data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      {data.summary && <div style={{ borderLeft: "2px solid #111", paddingLeft: 14, marginBottom: 24, color: "#444", fontSize: 13 }}>{data.summary}</div>}
      {["Experience", "Education", "Skills", "Projects", "Certifications"].map(sec => {
        if (sec === "Skills" && data.skills) return (
          <div key={sec} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#999", marginBottom: 8 }}>{sec}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.skills.split(",").map(s => s.trim()).filter(Boolean).map((sk, i) => <span key={i} style={{ fontSize: 11, color: "#555" }}>{sk}</span>).flatMap((el, i, arr) => i < arr.length - 1 ? [el, <span key={`sep${i}`} style={{ color: "#ccc" }}>·</span>] : [el])}
            </div>
          </div>
        );
        if (sec === "Experience" && data.experience.some(e => e.company)) return (
          <div key={sec} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#999", marginBottom: 8 }}>{sec}</div>
            {data.experience.filter(e => e.company).map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><b>{e.role} — {e.company}</b><span style={{ fontSize: 11, color: "#aaa" }}>{e.duration}</span></div>
                {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 11, paddingLeft: 10, color: "#555" }}>— {pt}</div>)}
              </div>
            ))}
          </div>
        );
        if (sec === "Education" && data.education.some(e => e.institution)) return (
          <div key={sec} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#999", marginBottom: 8 }}>{sec}</div>
            {data.education.filter(e => e.institution).map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span><b>{e.degree}</b>, {e.institution}</span><span style={{ fontSize: 11, color: "#aaa" }}>{e.year}</span>
              </div>
            ))}
          </div>
        );
        if (sec === "Projects" && data.projects.some(p => p.name)) return (
          <div key={sec} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#999", marginBottom: 8 }}>{sec}</div>
            {data.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: 6 }}><b>{p.name}</b>{p.tech && <span style={{ fontSize: 11, color: "#888" }}> ({p.tech})</span>}{p.desc && <span style={{ fontSize: 11, color: "#555" }}> — {p.desc}</span>}</div>)}
          </div>
        );
        return null;
      })}
    </div>
  );
}

// ── 4. Executive ───────────────────────────────────────────────────────────────
function ExecutiveLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "Georgia, serif", fontSize: 12, color: "#1a1a1a", background: "#fff" }}>
      {/* Header Banner */}
      <div style={{ background: "#1e3a5f", color: "#fff", padding: "28px 40px" }}>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 1 }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: 13, color: "#93c5fd", marginTop: 3 }}>{data.title}</div>
        <div style={{ display: "flex", gap: 20, marginTop: 10, fontSize: 11, color: "#bfdbfe", flexWrap: "wrap" }}>
          {[data.email, data.phone, data.location].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      <div style={{ padding: "28px 40px" }}>
        {data.summary && <div style={{ background: "#f0f4f8", borderLeft: "4px solid #1e3a5f", padding: "12px 16px", marginBottom: 20, color: "#374151", fontSize: 13 }}>{data.summary}</div>}
        <EXSec title="Professional Experience">
          {data.experience.filter(e => e.company).map((e, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div><b style={{ fontSize: 13 }}>{e.role}</b> <span style={{ color: "#1e3a5f", fontSize: 12 }}>| {e.company}</span></div>
                <span style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>{e.duration}</span>
              </div>
              {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 12, paddingLeft: 14, color: "#374151" }}>▸ {pt}</div>)}
            </div>
          ))}
        </EXSec>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <EXSec title="Education">
            {data.education.filter(e => e.institution).map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}><b>{e.degree}</b><div style={{ fontSize: 11, color: "#6b7280" }}>{e.institution}{e.gpa ? ` · ${e.gpa}` : ""} · {e.year}</div></div>
            ))}
          </EXSec>
          <EXSec title="Core Skills">
            <div style={{ columns: 2, columnGap: 8 }}>
              {data.skills.split(",").map(s => s.trim()).filter(Boolean).map((sk, i) => (
                <div key={i} style={{ fontSize: 11, marginBottom: 4, color: "#374151" }}>✓ {sk}</div>
              ))}
            </div>
          </EXSec>
        </div>
      </div>
    </div>
  );
}
function EXSec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "#1e3a5f", borderBottom: "2px solid #1e3a5f", paddingBottom: 4, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

// ── 5. Timeline ────────────────────────────────────────────────────────────────
function TimelineLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: "#111", padding: "32px 36px", background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 900 }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: 13, color: "#dc2626", fontWeight: 600, marginTop: 3 }}>{data.title}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6, fontSize: 11, color: "#666", flexWrap: "wrap" }}>
          {[data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      {data.summary && <div style={{ textAlign: "center", color: "#555", fontSize: 12, marginBottom: 20, fontStyle: "italic" }}>{data.summary}</div>}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#dc2626", marginBottom: 12 }}>Experience</div>
      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 2, background: "#fecaca" }} />
        {data.experience.filter(e => e.company).map((e, i) => (
          <div key={i} style={{ marginBottom: 16, position: "relative" }}>
            <div style={{ position: "absolute", left: -24, top: 3, width: 10, height: 10, borderRadius: "50%", background: "#dc2626", border: "2px solid #fff", boxShadow: "0 0 0 2px #dc2626" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}><b>{e.role} — {e.company}</b><span style={{ fontSize: 11, color: "#9ca3af" }}>{e.duration}</span></div>
            {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 11, paddingLeft: 8, color: "#555" }}>• {pt}</div>)}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#dc2626", marginBottom: 8 }}>Education</div>
          {data.education.filter(e => e.institution).map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}><b>{e.degree}</b><div style={{ fontSize: 11, color: "#555" }}>{e.institution} · {e.year}</div></div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#dc2626", marginBottom: 8 }}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {data.skills.split(",").map(s => s.trim()).filter(Boolean).map((sk, i) => (
              <span key={i} style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{sk}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 6. Tech (dark header) ──────────────────────────────────────────────────────
function TechLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, background: "#fff" }}>
      <div style={{ background: "#0f172a", color: "#e2e8f0", padding: "24px 36px" }}>
        <span style={{ color: "#22d3ee", fontSize: 22, fontWeight: 900 }}>{data.name || "Your Name"}</span>
        {data.title && <span style={{ color: "#64748b", fontSize: 13, marginLeft: 12 }}>// {data.title}</span>}
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 10, color: "#475569", flexWrap: "wrap" }}>
          {[data.email, data.phone, data.location, data.github, data.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      <div style={{ padding: "24px 36px", color: "#1e293b" }}>
        {data.summary && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "10px 14px", marginBottom: 18, borderRadius: 6, fontSize: 12, color: "#166534" }}>// {data.summary}</div>}
        <TKSec title="experience">
          {data.experience.filter(e => e.company).map((e, i) => (
            <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: "3px solid #22d3ee" }}>
              <div><b style={{ color: "#0f172a" }}>{e.role}</b> @ <span style={{ color: "#0891b2" }}>{e.company}</span> <span style={{ fontSize: 10, color: "#94a3b8" }}>[{e.duration}]</span></div>
              {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 11, color: "#334155" }}>→ {pt}</div>)}
            </div>
          ))}
        </TKSec>
        <TKSec title="skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.skills.split(",").map(s => s.trim()).filter(Boolean).map((sk, i) => (
              <span key={i} style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", color: "#065f46", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{sk}</span>
            ))}
          </div>
        </TKSec>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <TKSec title="education">
            {data.education.filter(e => e.institution).map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}><b>{e.degree}</b><div style={{ fontSize: 11, color: "#64748b" }}>{e.institution} · {e.year}</div></div>
            ))}
          </TKSec>
          <TKSec title="projects">
            {data.projects.filter(p => p.name).map((p, i) => (
              <div key={i} style={{ marginBottom: 6 }}><b style={{ color: "#0891b2" }}>{p.name}</b>{p.tech && <span style={{ fontSize: 10, color: "#94a3b8" }}> ({p.tech})</span>}{p.desc && <div style={{ fontSize: 11, color: "#475569" }}>{p.desc}</div>}</div>
            ))}
          </TKSec>
        </div>
      </div>
    </div>
  );
}
function TKSec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee", textTransform: "lowercase", marginBottom: 8 }}><span style={{ color: "#64748b" }}>const </span>{title} <span style={{ color: "#64748b" }}>= {"{"}</span></div>
      <div style={{ paddingLeft: 12 }}>{children}</div>
      <div style={{ fontSize: 10, color: "#64748b" }}>{"}"}</div>
    </div>
  );
}

// ── 7. Creative (color stripe) ─────────────────────────────────────────────────
function CreativeLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", background: "#fff", fontSize: 12 }}>
      <div style={{ width: 220, background: "#7c3aed", color: "#fff", padding: "32px 20px", flexShrink: 0 }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
          {(data.name || "Y")[0].toUpperCase()}
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: 11, color: "#ddd6fe", marginTop: 2, marginBottom: 20 }}>{data.title}</div>
        <CRSec title="Contact">
          {data.email    && <div style={{ fontSize: 10, color: "#ede9fe", marginBottom: 4 }}>✉ {data.email}</div>}
          {data.phone    && <div style={{ fontSize: 10, color: "#ede9fe", marginBottom: 4 }}>📞 {data.phone}</div>}
          {data.location && <div style={{ fontSize: 10, color: "#ede9fe", marginBottom: 4 }}>📍 {data.location}</div>}
          {data.linkedin && <div style={{ fontSize: 10, color: "#ede9fe", marginBottom: 4 }}>in {data.linkedin}</div>}
          {data.github   && <div style={{ fontSize: 10, color: "#ede9fe", marginBottom: 4 }}>⌂ {data.github}</div>}
        </CRSec>
        <CRSec title="Skills">
          {data.skills.split(",").map(s => s.trim()).filter(Boolean).map((sk, i) => (
            <div key={i} style={{ fontSize: 10, color: "#ede9fe", marginBottom: 5 }}>
              <div style={{ height: 2, background: "rgba(255,255,255,0.3)", borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#fff", width: "70%" }} />
              </div>
              {sk}
            </div>
          ))}
        </CRSec>
      </div>
      <div style={{ flex: 1, padding: "32px 24px" }}>
        {data.summary && <><div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Profile</div><p style={{ color: "#374151", marginBottom: 20 }}>{data.summary}</p></>}
        {data.experience.some(e => e.company) && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Experience</div>
          {data.experience.filter(e => e.company).map((e, i) => (
            <div key={i} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: "3px solid #ddd6fe" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><b>{e.role}</b><span style={{ fontSize: 10, color: "#9ca3af" }}>{e.duration}</span></div>
              <div style={{ fontSize: 11, color: "#7c3aed", marginBottom: 2 }}>{e.company}</div>
              {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 11, color: "#4b5563" }}>• {pt}</div>)}
            </div>
          ))}
        </>}
        {data.education.some(e => e.institution) && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, marginTop: 18 }}>Education</div>
          {data.education.filter(e => e.institution).map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}><b>{e.degree}</b><div style={{ fontSize: 11, color: "#6b7280" }}>{e.institution} · {e.year}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</div></div>
          ))}
        </>}
        {data.projects.some(p => p.name) && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, marginTop: 18 }}>Projects</div>
          {data.projects.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}><b>{p.name}</b>{p.tech && <span style={{ fontSize: 10, color: "#9ca3af" }}> · {p.tech}</span>}{p.desc && <div style={{ fontSize: 11, color: "#4b5563" }}>{p.desc}</div>}</div>
          ))}
        </>}
      </div>
    </div>
  );
}
function CRSec({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 20 }}><div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#c4b5fd", marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 4 }}>{title}</div>{children}</div>;
}

// ── 8. Compact ─────────────────────────────────────────────────────────────────
function CompactLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#111", padding: "24px 30px", background: "#fff", lineHeight: 1.45 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #111", paddingBottom: 8, marginBottom: 12 }}>
        <div><div style={{ fontSize: 20, fontWeight: 900 }}>{data.name || "Your Name"}</div><div style={{ fontSize: 12, color: "#555" }}>{data.title}</div></div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#666" }}>
          {data.email    && <div>{data.email}</div>}
          {data.phone    && <div>{data.phone}</div>}
          {data.location && <div>{data.location}</div>}
          {data.linkedin && <div>{data.linkedin}</div>}
          {data.github   && <div>{data.github}</div>}
        </div>
      </div>
      {data.summary && <div style={{ marginBottom: 10, fontSize: 11, color: "#444" }}>{data.summary}</div>}
      {data.experience.some(e => e.company) && <>
        <CPSec title="EXPERIENCE" />
        {data.experience.filter(e => e.company).map((e, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><b>{e.role}, {e.company}</b><span style={{ fontSize: 10, color: "#777" }}>{e.duration}</span></div>
            {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ paddingLeft: 10, color: "#444", fontSize: 10 }}>• {pt}</div>)}
          </div>
        ))}
      </>}
      {data.education.some(e => e.institution) && <>
        <CPSec title="EDUCATION" />
        {data.education.filter(e => e.institution).map((e, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span><b>{e.degree}</b>, {e.institution}{e.gpa ? ` (${e.gpa})` : ""}</span><span style={{ fontSize: 10, color: "#777" }}>{e.year}</span>
          </div>
        ))}
      </>}
      {data.skills && <>
        <CPSec title="SKILLS" />
        <div style={{ marginBottom: 8 }}>{data.skills.split(",").map(s => s.trim()).filter(Boolean).join(" · ")}</div>
      </>}
      {data.projects.some(p => p.name) && <>
        <CPSec title="PROJECTS" />
        {data.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: 4 }}><b>{p.name}</b>{p.tech && <span style={{ fontSize: 10, color: "#666" }}> ({p.tech})</span>}{p.desc && <span style={{ color: "#444" }}> — {p.desc}</span>}</div>)}
      </>}
    </div>
  );
}
function CPSec({ title }: { title: string }) {
  return <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, borderBottom: "1px solid #ccc", paddingBottom: 2, marginBottom: 6, marginTop: 10, color: "#333" }}>{title}</div>;
}

// ── 9. Elegant (centered header) ───────────────────────────────────────────────
function ElegantLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "Palatino, Georgia, serif", fontSize: 12, color: "#2c2c2c", padding: "40px 48px", background: "#fffdf7" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{data.name || "Your Name"}</div>
        {data.title && <div style={{ fontSize: 13, color: "#b45309", letterSpacing: 1, marginTop: 4, fontStyle: "italic" }}>{data.title}</div>}
        <div style={{ width: 60, height: 1, background: "#b45309", margin: "12px auto" }} />
        <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 11, color: "#6b5c3e", flexWrap: "wrap" }}>
          {[data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      {data.summary && <div style={{ textAlign: "center", fontStyle: "italic", color: "#6b5c3e", marginBottom: 24, fontSize: 13 }}>{data.summary}</div>}
      {data.experience.some(e => e.company) && <ELSec title="Experience" color="#b45309">{data.experience.filter(e => e.company).map((e, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b>{e.role}</b><i style={{ fontSize: 11, color: "#9ca3af" }}>{e.duration}</i></div>
          <div style={{ fontSize: 12, color: "#b45309", marginBottom: 2 }}>{e.company}</div>
          {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 11, paddingLeft: 10, color: "#4b3e2c" }}>• {pt}</div>)}
        </div>
      ))}</ELSec>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {data.education.some(e => e.institution) && <ELSec title="Education" color="#b45309">{data.education.filter(e => e.institution).map((e, i) => (<div key={i} style={{ marginBottom: 8 }}><b>{e.degree}</b><div style={{ fontSize: 11, color: "#6b5c3e" }}>{e.institution} · {e.year}</div></div>))}</ELSec>}
        {data.skills && <ELSec title="Skills" color="#b45309"><div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{data.skills.split(",").map(s => s.trim()).filter(Boolean).map((sk, i) => (<span key={i} style={{ background: "#fef3c7", color: "#92400e", borderRadius: 3, padding: "1px 8px", fontSize: 10 }}>{sk}</span>))}</div></ELSec>}
      </div>
    </div>
  );
}
function ELSec({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 18 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color, borderBottom: `1px solid ${color}40`, paddingBottom: 4, marginBottom: 10 }}>{title}</div>{children}</div>;
}

// ── 10. ATS Safe ───────────────────────────────────────────────────────────────
function ATSLayout({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12, color: "#000", padding: "28px 32px", background: "#fff", lineHeight: 1.5 }}>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{data.name || "Your Name"}</div>
        {data.title && <div style={{ fontSize: 13, marginTop: 2 }}>{data.title}</div>}
        <div style={{ marginTop: 4, fontSize: 11 }}>
          {[data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean).join("  |  ")}
        </div>
      </div>
      {data.summary && <><hr style={{ border: "none", borderTop: "1px solid #000", margin: "8px 0" }} /><div style={{ fontSize: 11, marginBottom: 10 }}><b>SUMMARY</b><br />{data.summary}</div></>}
      {data.experience.some(e => e.company) && <>
        <hr style={{ border: "none", borderTop: "1px solid #000", margin: "8px 0" }} />
        <b>EXPERIENCE</b>
        {data.experience.filter(e => e.company).map((e, i) => (
          <div key={i} style={{ marginTop: 8 }}>
            <b>{e.role}</b> - {e.company} ({e.duration})
            {e.points.split("\n").filter(Boolean).map((pt, j) => <div key={j} style={{ paddingLeft: 12 }}>• {pt}</div>)}
          </div>
        ))}
      </>}
      {data.education.some(e => e.institution) && <>
        <hr style={{ border: "none", borderTop: "1px solid #000", margin: "8px 0" }} />
        <b>EDUCATION</b>
        {data.education.filter(e => e.institution).map((e, i) => (
          <div key={i} style={{ marginTop: 6 }}><b>{e.degree}</b> - {e.institution} ({e.year}){e.gpa ? ` | GPA: ${e.gpa}` : ""}</div>
        ))}
      </>}
      {data.skills && <>
        <hr style={{ border: "none", borderTop: "1px solid #000", margin: "8px 0" }} />
        <b>SKILLS</b><br />{data.skills}
      </>}
      {data.projects.some(p => p.name) && <>
        <hr style={{ border: "none", borderTop: "1px solid #000", margin: "8px 0" }} />
        <b>PROJECTS</b>
        {data.projects.filter(p => p.name).map((p, i) => (
          <div key={i} style={{ marginTop: 6 }}><b>{p.name}</b>{p.tech ? ` (${p.tech})` : ""}: {p.desc}</div>
        ))}
      </>}
      {data.certifications && <>
        <hr style={{ border: "none", borderTop: "1px solid #000", margin: "8px 0" }} />
        <b>CERTIFICATIONS</b>
        {data.certifications.split("\n").filter(Boolean).map((c, i) => <div key={i}>• {c}</div>)}
      </>}
    </div>
  );
}

// ── Sample data for template thumbnails ───────────────────────────────────────
const SAMPLE: ResumeData = {
  name: "Alex Johnson", title: "Software Engineer",
  email: "alex@email.com", phone: "+91 9876543210",
  location: "Hyderabad", linkedin: "linkedin.com/in/alex", github: "github.com/alex",
  summary: "Passionate engineer with 3 years building scalable systems.",
  experience: [{ company: "Google", role: "SDE II", duration: "2022–Present", points: "Built APIs\nReduced latency 40%" }],
  education: [{ institution: "IIT Hyderabad", degree: "B.Tech CSE", year: "2022", gpa: "9.1" }],
  skills: "React, Node.js, Python, AWS, Docker",
  projects: [{ name: "Skillora AI", tech: "React, FastAPI", desc: "AI career platform used by 10K users." }],
  certifications: "AWS Certified Developer",
};
const inp   = "w-full bg-[#060606] border border-white/8 focus:border-red-500/50 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-sm placeholder:text-zinc-700 transition-all";
const lbl   = "block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5";

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ResumeBuilderPage() {
  const [data, setData]       = useState<ResumeData>(EMPTY);
  const [tplId, setTplId]     = useState<TplId>(1);
  const [section, setSection] = useState("personal");
  const previewRef            = useRef<HTMLDivElement>(null);

  const set     = (f: keyof ResumeData, v: any) => setData(d => ({ ...d, [f]: v }));
  const setExp  = (i: number, f: keyof ResumeData["experience"][0], v: string) => { const a = [...data.experience]; a[i] = { ...a[i], [f]: v }; set("experience", a); };
  const setEdu  = (i: number, f: keyof ResumeData["education"][0],  v: string) => { const a = [...data.education];  a[i] = { ...a[i], [f]: v }; set("education",  a); };
  const setProj = (i: number, f: keyof ResumeData["projects"][0],   v: string) => { const a = [...data.projects];   a[i] = { ...a[i], [f]: v }; set("projects",   a); };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win || !previewRef.current) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${data.name || "Resume"}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{}</style></head><body>${previewRef.current.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  };

  const SECTIONS = [
    { id: "personal",   label: "Personal" },
    { id: "experience", label: "Experience" },
    { id: "education",  label: "Education" },
    { id: "skills",     label: "Skills" },
    { id: "projects",   label: "Projects" },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-red-600/6 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-6 py-3.5 flex justify-between items-center sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <SkilloraLogo size={28} />
          <span className="text-base font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Dashboard
          </Link>
          <button onClick={handlePrint} className="btn-red text-xs px-4 py-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Download PDF
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col lg:flex-row h-[calc(100vh-57px)]">

        {/* ── Left: Editor ── */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col border-r border-white/5 overflow-hidden">

          {/* Template Picker — real mini previews */}
          <div className="px-5 py-4 border-b border-white/5 flex-shrink-0">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Layout Template <span className="text-red-400 normal-case font-normal">— click to select</span>
            </p>
            <div className="grid grid-cols-5 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTplId(t.id as TplId)}
                  title={`${t.name}: ${t.desc}`}
                  className={`rounded-xl border-2 transition-all overflow-hidden flex flex-col ${
                    tplId === t.id
                      ? "border-red-500 ring-1 ring-red-500/40 scale-[1.04]"
                      : "border-white/8 hover:border-red-500/40 hover:scale-[1.02]"
                  }`}
                  style={{ height: 90 }}
                >
                  {/* Scaled-down real resume preview */}
                  <div className="flex-1 overflow-hidden relative">
                    <div
                      style={{
                        transform: "scale(0.175)",
                        transformOrigin: "top left",
                        width: "570%",
                        height: "570%",
                        pointerEvents: "none",
                      }}
                    >
                      <ResumePreview data={SAMPLE} tplId={t.id as TplId} />
                    </div>
                  </div>
                  {/* Label */}
                  <div className={`px-1 py-1 text-center flex-shrink-0 ${tplId === t.id ? "bg-red-600" : "bg-[#1a1a1a]"}`}>
                    <span className="text-[9px] font-bold text-white leading-none">{t.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-2">
              <span className="text-red-400 font-semibold">{TEMPLATES.find(t => t.id === tplId)?.name}</span>
              {" — "}{TEMPLATES.find(t => t.id === tplId)?.desc}
            </p>
          </div>

          {/* Section Tabs */}
          <div className="flex border-b border-white/5 flex-shrink-0 overflow-x-auto">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${section === s.id ? "text-red-400 border-b-2 border-red-500" : "text-zinc-600 hover:text-zinc-300"}`}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

            {section === "personal" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className={lbl}>Full Name</p><input className={inp} placeholder="John Doe" value={data.name} onChange={e => set("name", e.target.value)} /></div>
                  <div><p className={lbl}>Title / Role</p><input className={inp} placeholder="Software Engineer" value={data.title} onChange={e => set("title", e.target.value)} /></div>
                  <div><p className={lbl}>Email</p><input className={inp} placeholder="john@email.com" value={data.email} onChange={e => set("email", e.target.value)} /></div>
                  <div><p className={lbl}>Phone</p><input className={inp} placeholder="+91 9876543210" value={data.phone} onChange={e => set("phone", e.target.value)} /></div>
                  <div><p className={lbl}>Location</p><input className={inp} placeholder="Hyderabad, India" value={data.location} onChange={e => set("location", e.target.value)} /></div>
                  <div><p className={lbl}>LinkedIn</p><input className={inp} placeholder="linkedin.com/in/john" value={data.linkedin} onChange={e => set("linkedin", e.target.value)} /></div>
                  <div className="col-span-2"><p className={lbl}>GitHub</p><input className={inp} placeholder="github.com/john" value={data.github} onChange={e => set("github", e.target.value)} /></div>
                </div>
                <div><p className={lbl}>Professional Summary</p><textarea rows={4} className={inp + " resize-none"} placeholder="Results-driven software engineer with 3+ years..." value={data.summary} onChange={e => set("summary", e.target.value)} /></div>
              </>
            )}

            {section === "experience" && (
              <>
                {data.experience.map((exp, i) => (
                  <div key={i} className="card-inset p-4 space-y-3">
                    <div className="flex justify-between items-center"><p className="text-xs font-bold text-red-400">Experience {i + 1}</p>{data.experience.length > 1 && <button onClick={() => set("experience", data.experience.filter((_, j) => j !== i))} className="text-zinc-600 hover:text-red-400 text-xs">Remove</button>}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><p className={lbl}>Company</p><input className={inp} placeholder="Google" value={exp.company} onChange={e => setExp(i, "company", e.target.value)} /></div>
                      <div><p className={lbl}>Role</p><input className={inp} placeholder="SDE II" value={exp.role} onChange={e => setExp(i, "role", e.target.value)} /></div>
                      <div className="col-span-2"><p className={lbl}>Duration</p><input className={inp} placeholder="Jan 2022 – Present" value={exp.duration} onChange={e => setExp(i, "duration", e.target.value)} /></div>
                    </div>
                    <div><p className={lbl}>Key Points (one per line)</p><textarea rows={4} className={inp + " resize-none"} placeholder={"Built REST APIs\nReduced latency by 40%"} value={exp.points} onChange={e => setExp(i, "points", e.target.value)} /></div>
                  </div>
                ))}
                <button onClick={() => set("experience", [...data.experience, { company: "", role: "", duration: "", points: "" }])} className="btn-ghost w-full text-xs py-2.5">+ Add Experience</button>
              </>
            )}

            {section === "education" && (
              <>
                {data.education.map((edu, i) => (
                  <div key={i} className="card-inset p-4 space-y-3">
                    <div className="flex justify-between items-center"><p className="text-xs font-bold text-red-400">Education {i + 1}</p>{data.education.length > 1 && <button onClick={() => set("education", data.education.filter((_, j) => j !== i))} className="text-zinc-600 hover:text-red-400 text-xs">Remove</button>}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2"><p className={lbl}>Institution</p><input className={inp} placeholder="IIT Hyderabad" value={edu.institution} onChange={e => setEdu(i, "institution", e.target.value)} /></div>
                      <div><p className={lbl}>Degree</p><input className={inp} placeholder="B.Tech CSE" value={edu.degree} onChange={e => setEdu(i, "degree", e.target.value)} /></div>
                      <div><p className={lbl}>Year</p><input className={inp} placeholder="2020–2024" value={edu.year} onChange={e => setEdu(i, "year", e.target.value)} /></div>
                      <div><p className={lbl}>GPA / %</p><input className={inp} placeholder="8.9 / 10" value={edu.gpa} onChange={e => setEdu(i, "gpa", e.target.value)} /></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => set("education", [...data.education, { institution: "", degree: "", year: "", gpa: "" }])} className="btn-ghost w-full text-xs py-2.5">+ Add Education</button>
              </>
            )}

            {section === "skills" && (
              <div className="space-y-4">
                <div><p className={lbl}>Skills (comma separated)</p><textarea rows={5} className={inp + " resize-none"} placeholder="Python, Java, React, Node.js, SQL, Docker, AWS, Git" value={data.skills} onChange={e => set("skills", e.target.value)} /><p className="text-[10px] text-zinc-600 mt-1.5">Each skill displays as a tag on the resume</p></div>
                <div><p className={lbl}>Certifications (one per line)</p><textarea rows={4} className={inp + " resize-none"} placeholder={"AWS Certified Developer\nGoogle Cloud Professional"} value={data.certifications} onChange={e => set("certifications", e.target.value)} /></div>
              </div>
            )}

            {section === "projects" && (
              <>
                {data.projects.map((proj, i) => (
                  <div key={i} className="card-inset p-4 space-y-3">
                    <div className="flex justify-between items-center"><p className="text-xs font-bold text-red-400">Project {i + 1}</p>{data.projects.length > 1 && <button onClick={() => set("projects", data.projects.filter((_, j) => j !== i))} className="text-zinc-600 hover:text-red-400 text-xs">Remove</button>}</div>
                    <div><p className={lbl}>Project Name</p><input className={inp} placeholder="Skillora AI" value={proj.name} onChange={e => setProj(i, "name", e.target.value)} /></div>
                    <div><p className={lbl}>Tech Stack</p><input className={inp} placeholder="React, FastAPI, Groq AI" value={proj.tech} onChange={e => setProj(i, "tech", e.target.value)} /></div>
                    <div><p className={lbl}>Description</p><textarea rows={3} className={inp + " resize-none"} placeholder="Built an AI-powered career platform..." value={proj.desc} onChange={e => setProj(i, "desc", e.target.value)} /></div>
                  </div>
                ))}
                <button onClick={() => set("projects", [...data.projects, { name: "", tech: "", desc: "" }])} className="btn-ghost w-full text-xs py-2.5">+ Add Project</button>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        <div className="flex-1 overflow-y-auto bg-zinc-800/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-zinc-500">Live Preview — <span className="text-red-400">{TEMPLATES.find(t => t.id === tplId)?.name}</span> template</p>
              <p className="text-[10px] text-zinc-700">Fill the form on the left to see your resume build in real-time</p>
            </div>
            <div ref={previewRef} className="max-w-[760px] mx-auto shadow-2xl overflow-hidden rounded" style={{ minHeight: 900 }}>
              <ResumePreview data={data} tplId={tplId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
