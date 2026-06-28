import Link from "next/link";

// PRE-REVEAL landing: teases the four capabilities of an UNNAMED tool. No product
// name appears anywhere — the name is the launch reveal.
const CAPABILITIES = [
  {
    title: "Manage any cluster",
    body: "GKE (Standard + Autopilot), EKS (EC2 · Fargate · Auto Mode), AKS, k3s/kind — one tool, every cloud, every node type, through your existing kubeconfig.",
  },
  {
    title: "Secure it — mapped to CKS",
    body: "A security command center where every panel is a Certified Kubernetes Security Specialist exam domain. Audit RBAC, network policy, supply chain, and runtime — and practice the cert in the same place.",
  },
  {
    title: "Learn by doing",
    body: "Hands-on labs against real local clusters, step-by-step validation, and a timed CKS exam simulator. Don't just see the cluster — become the engineer who runs it.",
  },
  {
    title: "AI that understands your cluster",
    body: "A grounded assistant, a 'why is this pod CrashLooping?' RCA agent, and a kubectl copilot that shows a dry-run diff before anything is applied.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="hero__eyebrow">Building in public · one feature at a time</p>
        <h1 className="hero__title">
          A Kubernetes desktop app that <span className="grad">manages</span>,{" "}
          <span className="grad">secures</span>, <span className="grad">teaches</span>, and{" "}
          <span className="grad">thinks</span>.
        </h1>
        <p className="hero__sub">
          I&apos;m building the Kubernetes tool I always wanted — and showing one feature at a time
          until it&apos;s ready. Follow the build log.
        </p>
        <div className="hero__cta">
          <Link href="/blog" className="btn btn--primary">
            Read the build log
          </Link>
        </div>
      </section>

      <section className="caps">
        {CAPABILITIES.map((c) => (
          <article key={c.title} className="cap">
            <h2 className="cap__title">{c.title}</h2>
            <p className="cap__body">{c.body}</p>
          </article>
        ))}
      </section>
    </>
  );
}
