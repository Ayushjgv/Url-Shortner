import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../src/assets/hero.png";
import api from "../utils/axios";
import "./landing.css";
import { User, LayoutDashboard, Settings, LogOut, Sparkles, Link2, Globe, Check, Copy } from "lucide-react";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    const checkAuth = async ()=>{
      try{
        await api.get("/verifyUser");
        setisAuthenticated(true);
      }catch(error){
        console.log(error);
        setisAuthenticated(false);
      }
    }
    checkAuth();
  },[]);

  const ensureAuthenticated = async () => {
    if (isAuthenticated === true) return true;

    try {
      await api.get("/verifyUser");
      setisAuthenticated(true);
      return true;
    } catch (error) {
      console.log(error);
      setisAuthenticated(false);
      return false;
    }
  };

  const domainHost = useMemo(() => {
    return window.location.origin + "/";
  }, []);

  const displayHost = useMemo(() => {
    if (shortUrl) {
      try {
        return new URL(shortUrl).host;
      } catch {
        return shortUrl;
      }
    }
    return window.location.host || "shortly.link";
  }, [shortUrl]);

  const livePreviewText = useMemo(() => {
    if (shortUrl) return shortUrl;
    const trimmed = customSlug.trim();
    if (trimmed) {
      return `${domainHost}${trimmed}`;
    }
    return "Your generated link will appear here.";
  }, [shortUrl, customSlug, domainHost]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUrl = url.trim();
    const trimmedSlug = customSlug.trim();

    if (!trimmedUrl) {
      setStatus("error");
      setMessage("Paste a URL before shortening it.");
      return;
    }

    if (trimmedSlug) {
      if (trimmedSlug.length < 3 || trimmedSlug.length > 30) {
        setStatus("error");
        setMessage("Custom alias must be between 3 and 30 characters.");
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(trimmedSlug)) {
        setStatus("error");
        setMessage("Custom alias can only contain letters, numbers, hyphens, and underscores.");
        return;
      }
    }

    const authenticated = await ensureAuthenticated();

    if (!authenticated) {
      navigate("/login");
      return;
    }

    setStatus("loading");
    setMessage("Creating your short link...");
    setShortUrl("");
    setCopied(false);

    try {
      const response = await api.post("/create", { 
        url: trimmedUrl,
        customSlug: trimmedSlug || undefined
      });

      setShortUrl(response.data);
      setStatus("success");
      setMessage(trimmedSlug ? "Your custom short link is ready!" : "Your short link is ready.");
    } catch (error) {
      setStatus("error");
      const errorMsg = error.response?.data || error.message || "Something went wrong.";
      setMessage(errorMsg);
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

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setisAuthenticated(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
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

        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full p-2 hover:bg-gray-200 transition"
          >
            <User size={22} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-lg z-50">
              <button className="flex w-full items-center gap-3 px-4 py-3 bg-white hover:bg-gray-100" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard size={18} />
                Dashboard
              </button>

              <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100">
                <Settings size={18} />
                Settings
              </button>

              <hr />

              {isAuthenticated && (
                <button className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              )}
              {(!isAuthenticated && (
                <button className="flex w-full items-center gap-3 px-4 py-3 text-green-600 hover:bg-green-50" onClick={() => navigate("/login")}>
                  <LogOut size={18} />
                  Login
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="app-shell">
        <section className="hero-section" id="shorten">
          <div className="hero-copy">
            <p className="eyebrow">
              <Sparkles size={14} className="inline mr-1" /> Fast & Custom URL Shortener
            </p>

            <h1>Turn long links into clean, custom URLs.</h1>

            <p className="intro">
              Paste any destination URL and personalize your short link with a custom alias for memorable sharing.
            </p>

            <form className="shorten-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="url">
                  <Link2 size={16} className="inline-icon" /> Destination URL
                </label>
                <div className="input-row">
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very-long-destination-path"
                    required
                  />
                </div>
              </div>

              <div className="form-group custom-url-group">
                <div className="label-with-badge">
                  <label htmlFor="customSlug">
                    <Sparkles size={16} className="inline-icon highlight-icon" /> Custom Link Alias
                  </label>
                  <span className="optional-badge">Optional</span>
                </div>
                <div className="custom-input-wrapper">
                  <span className="domain-prefix">{domainHost}</span>
                  <input
                    id="customSlug"
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="e.g. my-custom-link"
                    maxLength={30}
                  />
                </div>
                <p className="field-hint">3-30 characters (letters, numbers, hyphens & underscores)</p>
              </div>

              <button type="submit" className="submit-btn" disabled={status === "loading"}>
                {status === "loading" ? "Creating..." : "Shorten URL"}
              </button>

              {message && <p className={`status-message ${status}`}>{message}</p>}
            </form>

            {shortUrl && (
              <section className="result-panel">
                <div>
                  <span className="result-label">Short URL Created</span>

                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {shortUrl}
                  </a>
                </div>

                <button onClick={handleCopy} className="copy-button">
                  {copied ? (
                    <>
                      <Check size={16} className="inline mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="inline mr-1" /> Copy
                    </>
                  )}
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
                <div className="preview-header-row">
                  <span className="preview-label">Live Preview</span>
                  {customSlug.trim() && !shortUrl && (
                    <span className="custom-active-badge">Custom Alias Active</span>
                  )}
                </div>

                <strong>{displayHost}</strong>

                <p className={customSlug.trim() && !shortUrl ? "custom-highlight-preview" : ""}>
                  {livePreviewText}
                </p>
              </div>

              <div className="metric-grid">
                <div>
                  <span>Redirects</span>
                  <strong>Instant</strong>
                </div>

                <div>
                  <span>Alias Mode</span>
                  <strong>{customSlug.trim() ? "Custom Slug" : "Auto NanoID"}</strong>
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
