# Designwave PRD: v1.0.0.a (Alpha MVP)

**Status**: Draft | **Version**: 1.0.0.a | **Date**: 2026-04-17
**Product Vision**: A Lovable-style, AI-native website builder that empowers entrepreneurs to design and build hi-fidelity, on-trend, and optimised websites powered by Payload CMS with £0 overhead.

---

## 1. Goal Description

Designwave is an AI-driven IDE workbench designed for rapid creation of professional landing pages and websites. It blends the visual intuition of Lovable with the developer power of Replit, ensuring all output is standards-based, lightweight, and purpose-appropriate.

---

## 2. Critical Audit (v0.9.x to v1.0.0.a)

The current build provides a robust foundation but requires refinement to hit "Alpha" standards:

- **Workbench UI**: Current implementation uses a desktop-first layout. Alpha must transition to a mobile-first responsive design throughout.
- **Canvas Preview**: Uses a basic `iframe` injection. Needs optimisation to handle complex Payload CMS component previews and cross-device testing.
- **AI Integration**: The BYOK (Bring Your Own Key) system is functional but requires better British English prompt engineering to ensure "on-trend" design outputs.
- **Deployment**: Basic flows exist for Vercel/Netlify but need validation for lightweight Payload 3.0 builds.

---

## 3. Core Constraints & Localisation

- **Cost**: **£0 Running/Build cost**. All infrastructure must utilise Free Tiers (Supabase, Neon/Postgres, Vercel/Netlify, Gemini 1.5 Flash).
- **Language**: **British English** (spelling and grammar) used exclusively in the app and the PRD.
- **Currency**: **GBP (£)** as the default currency for all components and accounting.
- **Performance**: Must operate fluidly on 4G/5G connections; lightweight asset delivery is a P0 requirement.

---

## 4. MVP Feature Prioritisation

### P0: Essential for v1.0.0.a

- **Mobile-First Responsive Workbench**: All IDE components (sidebar, editor, terminal) must scale gracefully to mobile screens.
- **AI Design Engine (Alpha)**: Generates hi-fi, industry-appropriate landing pages using Payload CMS + Tailwind CSS.
- **Payload CMS Integration**: Automatic setup of Media and User collections with Postgres persistence.
- **One-Click Publish**: Seamless deployment flow to Vercel/Netlify using personal access tokens.
- **British Standard Defaults**: Pre-configured British English and GBP (£) formatting for all generated templates.

### P1: Fast-Follow (Alpha+ / Beta-ready)

- **Contextual AI Suggestions**: Real-time advice on design trends, psychology-appropriate colour palettes, and SEO.
- **Optimised Media Handling**: Automated image compression and WebP conversion via Payload.
- **Project Snapshots**: Basic versioning or "Restore Points" within the workbench.

### P2: Refinement

- **Advanced Micro-animations**: Adding premium feel to the generated sites without bloating bundle sizes.
- **WCAG Accessibility Auditor**: AI-driven check for contrast, spacing, and semantic HTML.

---

## 5. Future Roadmap

- **Multi-user Collaboration**: Real-time pair-designing.
- **Advanced Domain Management**: Custom DNS and SSL beyond managed provider subdomains.
- **Plugin Marketplace**: Community-driven skills and UI components.
- **Advanced Currency Localisation**: Per-user account currency preferences (beyond GBP).

---

## 6. Verification & Quality Standards

- **Lighthouse Scores**: Generated sites must target 90+ across Performance, Accessibility, and Best Practices.
- **Connectivity**: Validating the app's initial load and AI interaction latency on throttled 4G connections.
- **Responsiveness**: Manual and automated tests across iOS/Android viewport sizes.
