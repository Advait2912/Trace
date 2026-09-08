import React, { useState } from "react";
import fixturesData from "./fixtures.json";
import { HookSection } from "./sections/01_Hook";
import { TwoWaysToRememberSection } from "./sections/02_TwoWaysToRemember";
import { TheMechanismSection } from "./sections/03_TheMechanism";
import { VisualWalkthroughSection } from "./sections/04_VisualWalkthrough";
import { PredictThenCompareSection } from "./sections/05_PredictThenCompare";
import { ManipulateSection } from "./sections/06_Manipulate";
import { InterferenceOverlappingKeysSection } from "./sections/07_InterferenceOverlappingKeys";
import { BdhModuleSection } from "./sections/08_BdhModule";
import { BdhCqModuleSection } from "./sections/09_BdhCqModule";
import { LimitationsEvidenceSection } from "./sections/10_LimitationsEvidence";

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>("section-01-hook");

  const navItems = [
    { id: "section-01-hook", label: "01. Hook" },
    { id: "section-02-two-ways", label: "02. Two Paradigms" },
    { id: "section-03-mechanism", label: "03. Mechanism" },
    { id: "section-04-walkthrough", label: "04. Walkthrough" },
    { id: "section-05-predict", label: "05. Predict & Compare" },
    { id: "section-06-manipulate", label: "06. Live Sandbox" },
    { id: "section-07-interference", label: "07. Interference" },
    { id: "section-08-bdh", label: "08. BDH Foundations" },
    { id: "section-09-bdh-cq", label: "09. BDH-CQ Report" },
    { id: "section-10-limitations", label: "10. Evidence & Limits" },
  ];

  const scrollTo = (id: string) => {
    setActiveNav(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="trace-app">
      {/* Top Header */}
      <header className="trace-header">
        <div className="header-left">
          <span className="brand-logo">TRACE</span>
          <span className="brand-divider">/</span>
          <span className="brand-sub">Memory in Motion</span>
          <span className="badge-pill">DataForge 2026 × Pathway Track (PS1)</span>
        </div>
        <div className="header-right">
          <span className="citation-pill">
            BDH-CQ §3.2 Special Case: <code>S<sub>t</sub> = S<sub>t-1</sub> + v<sub>t</sub> k<sub>t</sub>ᵀ</code>
          </span>
        </div>
      </header>

      {/* Sticky Table of Contents Navigation Bar */}
      <nav className="sticky-toc">
        <div className="toc-track">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`toc-link ${activeNav === item.id ? "active" : ""}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Single Page Editorial Scroll */}
      <main className="essay-container">
        <HookSection fixtures={fixturesData} />
        <TwoWaysToRememberSection />
        <TheMechanismSection />
        <VisualWalkthroughSection fixtures={fixturesData} />
        <PredictThenCompareSection fixtures={fixturesData} />
        <ManipulateSection />
        <InterferenceOverlappingKeysSection fixtures={fixturesData} />
        <BdhModuleSection />
        <BdhCqModuleSection />
        <LimitationsEvidenceSection />
      </main>

      {/* Footer */}
      <footer className="trace-footer">
        <div className="footer-content">
          <p>
            <strong>TRACE: Memory in Motion</strong> — An interactive explainer with a live
            computational core.
          </p>
          <p className="disclaimer">
            Educational toy model instantiating the additive special case named in BDH-CQ §3.2. Not
            an official implementation of BDH or BDH-CQ.
          </p>
          <p className="copyright">DataForge 2026 Submission • Fully Reproducible</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
