import { useMemo, useState } from "react";
import heroImg from "../src/assets/hero.png";
import "./landing.css";

const API_ENDPOINT = "/api/create";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const displayHost = useMemo(() => {
    if (!shortUrl) return "short.link";

    try {
      return new URL(shortUrl).host;
    } catch {
      return shortUrl;
    }
  }, [shortUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setStatus("error");
      setMessage("Paste a URL before shortening it.");
      return;
    }

    setStatus("loading");
    setMessage("Creating your short link...");
    setShortUrl("");
    setCopied(false);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "The backend could not create a short link.");
      }

      setShortUrl(text);
      setStatus("success");
      setMessage("Your short link is ready.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong.");
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setStatus("error");
      setMessage("Copy failed.");
    }
  };

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand-row header-brand" href="/">
          <span className="brand-mark">S</span>
          <span>Shortly</span>
        </a>

        <nav className="site-nav">
          <a href="#shorten">Shorten</a>
          <a href="#preview">Preview</a>
          <a href="#footer">Support</a>
        </nav>

        <button className="user-button">
          <svg viewBox="0 0 24 24">
            <path d="M12 12.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z" />
            <path d="M4.75 20.25c.7-3.15 3.6-5.5 7.25-5.5s6.55 2.35 7.25 5.5" />
          </svg>
        </button>
      </header>

      <main className="app-shell">
        <section className="hero-section" id="shorten">
          <div className="hero-copy">
            <p className="eyebrow">Fast URL shortener</p>

            <h1>Turn long links into clean, shareable URLs.</h1>

            <p className="intro">
              Paste any destination URL and your backend will generate a compact
              redirect link.
            </p>

            <form className="shorten-form" onSubmit={handleSubmit}>
              <label htmlFor="url">Destination URL</label>

              <div className="input-row">
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />

                <button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Shortening..." : "Shorten URL"}
                </button>
              </div>

              <p className={`status-message ${status}`}>{message}</p>
            </form>

            {shortUrl && (
              <section className="result-panel">
                <div>
                  <span className="result-label">Short URL</span>

                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {shortUrl}
                  </a>
                </div>

                <button onClick={handleCopy} className="copy-button">
                  {copied ? "Copied" : "Copy"}
                </button>
              </section>
            )}
          </div>

          <aside className="preview-panel" id="preview">
            <img src={heroImg} className="preview-art" alt="" />

            <div className="preview-card">
              <div className="browser-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="link-preview">
                <span className="preview-label">Preview</span>

                <strong>{displayHost}</strong>

                <p>{shortUrl || "Your generated link will appear here."}</p>
              </div>

              <div className="metric-grid">
                <div>
                  <span>Redirects</span>
                  <strong>Instant</strong>
                </div>

                <div>
                  <span>API</span>
                  <strong>Connected</strong>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div>
          <a className="brand-row footer-brand" href="/">
            <span className="brand-mark">S</span>
            <span>Shortly</span>
          </a>

          <p>
            Built for compact links now, with space ready for authentication.
          </p>
        </div>

        <nav className="footer-nav">
          <a href="#shorten">Create Link</a>
          <a href="#preview">Preview</a>
          <a href="#footer">Login Soon</a>
        </nav>
      </footer>
    </div>
  );
}