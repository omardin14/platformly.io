// Published-post index for the public /blog. Drafts live (gitignored) in /blog;
// when a post is published, add a tracked entry here pointing at the canonical URL.
// PRE-REVEAL: never reference the product name in titles/blurbs.
export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  format: "tutorial" | "problem-solution" | "showcase";
  blurb: string;
  url?: string; // canonical (e.g. Medium); "#" until published
}

export const POSTS: Post[] = [
  {
    slug: "the-cks-exam-in-plain-english",
    title: "The CKS exam in plain English: the 6 domains and what each really tests",
    date: "2026-06-28",
    format: "tutorial",
    blurb:
      "A plain-English map of all six Certified Kubernetes Security Specialist domains — and the concrete skills each one tests.",
    url: "#",
  },
];
