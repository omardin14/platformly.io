import type { Metadata } from "next";
import { POSTS } from "@/content/posts";
import { SERIES_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Build log · ${SERIES_NAME}`,
  description: "Feature-by-feature notes from building a Kubernetes desktop app in public.",
};

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  return (
    <section className="blog">
      <h1 className="blog__title">Build log</h1>
      <p className="blog__intro">
        One feature at a time. New posts as the tool takes shape — the whole thing comes together at
        launch.
      </p>
      <ul className="postlist">
        {POSTS.map((p) => {
          const inner = (
            <>
              <div className="post__meta">
                <time>{fmtDate(p.date)}</time>
                <span className="post__tag">{p.format}</span>
              </div>
              <h2 className="post__title">{p.title}</h2>
              <p className="post__blurb">{p.blurb}</p>
            </>
          );
          return (
            <li key={p.slug} className="post">
              {p.url && p.url !== "#" ? (
                <a href={p.url} className="post__link" target="_blank" rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div className="post__link post__link--soon">
                  {inner}
                  <span className="post__soon">published soon</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
