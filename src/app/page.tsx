"use client";

import { useState, useTransition } from "react";
import { scrape, PreviewData } from "./actions/scrape";

export default function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<PreviewData | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePreview = () => {
    setError("");
    setData(null);

    startTransition(async () => {
      try {
        const result = await scrape(url);
        setData(result);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    });
  };

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h1>News Preview MVP</h1>

      <input
        type="url"
        placeholder="Paste news URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <button
        onClick={handlePreview}
        disabled={!url || isPending}
        style={{ marginTop: 12 }}
      >
        {isPending ? "Fetching..." : "Generate Preview"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <section
          style={{
            marginTop: 24,
            border: "1px solid #ddd",
            padding: 16,
          }}
        >
          {data.image && (
            <img
              src={data.image}
              alt=""
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
              }}
            />
          )}

          <label>Title</label>
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <label>Description</label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            style={{ width: "100%", minHeight: 80 }}
          />
        </section>
      )}
    </main>
  );
}
