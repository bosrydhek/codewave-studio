# Designwave Self-Serve Edition — Lean PRD (MVP, Enhanced)

### TL;DR

Designwave is an automated, premium website/landing page generator for founders, using an AI-powered pipeline to turn structured client briefs into deployable Payload CMS sites in hours. This MVP version integrates automated clarification workflows, value-based pricing (using client-provided ROI expectations), end-to-end revision cycles, a secure client memory system (RAG powered), and full internal audit/monitoring (Slack/MCP-ready) — all operating on a freemium, zero-human-in-the-loop model.

---

## 1. Executive Summary & Vibe Metrics

* Epic goal: Transform paid customer briefs into deployable, production-grade, premium Payload CMS websites, autonomously and at scale, using one-shot AI coding and robust revision/approval flows.
* Target free-tier compute: All major providers (Claude, Antigravity, AgentMail, Vercel, Supabase, GitHub) remain in free limits for ≤30 orders/mo (cost ceiling: £50/mo for overages only).

---

## 2. Payload CMS Schema & Open Design Mapping

* Full block/table as previously defined (see Appendix); updated to ensure each customer project, design system, and revision cycle persists in the client memory system (RAG-backed Postgres objects, UUID-linked across comms).
* Value-pricing and ROI profile fields included per client project.
* All design tokens, brief maps, page/block configs, status history, approval/review actions, and clarifications structurally aligned and stored.
* Open Design tokens; fallback logic (≥80% preset match, else custom tokens); all amendments/logs tied to persistent memory.

---

## 3. Modular Engineering Epics

**Epic 1: Intake, Payment, & Client Memory**

* Stripe payment intake, locking price in the £1,500–£5,000 band based on fixed scope and value-based logic (see below).
* Structured brief: collects all technical/branding requirements and anticipated project ROI (as self-reported by client; required input).
* Secure RAG memory: Every intake/revision/amendment, and ROI rationale, is indexed per client (Supabase/Neon free-tier Postgres, UUID keys).

**Epic 2: Automated Clarification, Comms, & Value Pricing**

* Claude Cowork (or live comms bot) autogenerates a lean PRD and generates a Designwave prompt; handles all info-gap and clarification dialogue using multi-channel real-time comms (email + SMS, with delivered/seen/response tracking).
* All pending client actions actively notified (retries/escalations).
* System logs all comms/exchanges for operator review.
* Value-pricing logic: At intake and during clarification, ask client for their expected project ROI, vertical, and use. Price is calculated within scope band according to rules (to be further detailed in pricing spec); rationale and client statement are stored for audit.

**Epic 3: Brief Ingestion, Parsing & Generation**

* AI parser (Claude/Antigravity) transforms briefs into JSON token maps.
* Token map triggers design system selection (preset vs. dynamic design).
* Generation pipeline outputs fully-formed Next.js/Payload CMS repo, with all blocks/pages, and links to persistent client/project record.

**Epic 4: Approvals, Revisions, & Delivery Lifecycle**

* After build, client receives review/approval notification (multi-channel alerts).
* If approved: Proceed to code delivery, post-project cost reconciliation (if required), and handoff.
* If rejected or revision requested: System prompts for structured feedback/amendment; allows up to N revision cycles before escalation.
* All approval/rejection interactions and versions are timestamped+persisted in client memory system.

**Epic 5: Internal Monitoring & Operator Escalation**

* All pipeline activity, comms, exceptions, and critical path logs forwarded to an internal Slack (or future MCP) channel for ops oversight.
* Manual override and support intervention available via direct Slack-actioned commands (pause pipeline, communicate directly, adjust status, trigger refunds, etc.).
* All manual actions are logged for audit/compliance.

---

## 4. Freemium Guardrails & Fail-Safes

* Strict payload size, storage, email, and code asset limits (as previously defined).
* Orders paused with client+operator notifications on any free-tier limit breach.
* Asset and comms volume tracked against free entitlements; system fallbacks, throttling, and pass-down notifications included.

---

## 5. Agile Definition of Done

* Pipeline is zero-human, or fully accountable for escalated interventions (all automatable steps covered).
* Every client/project record fully stored in the RAG memory system, with all ROI, comms, approvals, revisions, and output linked.
* Real-time comms and notification logic, with full alert, retry, and escalation flows.
* Internal Slack/MCP connector live (for ops/monitoring/support only).
* Modular Next.js/Payload repo, validated by automated QA and review loop, ready to deploy from GitHub.
* Audit log exists for all decision points.
* Everything launches within GBP localisation and British English content standards.

---

## Risks, Open Items, and Research/Apppendix

* Value-pricing reliability and client-input honesty: rely on user-supplied ROI (risk: over/underpricing). To be reviewed with future pricing model refinement.
* Ongoing RAG/permanent memory: spec required for scaling, privacy, GPDR compliance; design to permit secure deletions on request.
* Automated comms: Multi-channel reliability, clear escalation for unresponsive clients/operators.
* Approvals/revisions: Ensure N revision cycles is fair and enforceable.
* Slack/MCP: Evaluate options for resilient and secure operator channels; design for future extensibility.
* Intake workflow, RAG schema, pricing calc logic: further specs to be developed as follow-ons.

\[Appendix: unchanged block definition, Open Design mapping, and schema tables as referenced.\]
