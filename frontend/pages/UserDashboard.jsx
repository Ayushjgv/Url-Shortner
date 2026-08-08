import { useState, useEffect } from 'react';
import {
  CalendarDays,
  Copy,
  ExternalLink,
  Link2,
  Mail,
  MousePointerClick,
  RefreshCw,
  UserRound,
  Home,
  LogOut
} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import api from '../utils/axios';

const UserDashboard = (props) => {
  const [userDetails, setuserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{

    const getUserDetails = async()=>{
      try{
        setLoading(true);
        setError("");
        const res = await api.get("/getUserDetails");
        setuserDetails(res.data);
      }catch(err){
        console.log(err);
        setError("Could not load dashboard details.");
      } finally {
        setLoading(false);
      }
    }
    getUserDetails();

  },[]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Failed to log out.");
    }
  };

  const urls = userDetails?.urls || [];
  const totalClicks = urls.reduce((total, url) => total + (url.clicks || 0), 0);
  const user = userDetails?.user || props.User;
  const joinedDate = userDetails?.user?.createdAt
    ? new Date(userDetails.user.createdAt).toLocaleDateString()
    : "Recently";

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url.shortLink);
      setCopiedId(url.id);
      setTimeout(() => setCopiedId(""), 1400);
    } catch (err) {
      console.log(err);
      setError("Could not copy the short link.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-28 animate-pulse rounded-lg bg-white shadow-sm" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-lg bg-white shadow-sm" />
            <div className="h-28 animate-pulse rounded-lg bg-white shadow-sm" />
            <div className="h-28 animate-pulse rounded-lg bg-white shadow-sm" />
          </div>
          <div className="mt-6 h-80 animate-pulse rounded-lg bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 font-medium text-emerald-700 hover:text-emerald-800">
            <Home size={20} />
            <span>Back to Home</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-emerald-700 text-lg font-black text-white">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-500">Dashboard</p>
              <h1 className="truncate text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
                Welcome, {user?.username}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <Mail size={16} />
              <span className="max-w-64 truncate">{user?.email}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <CalendarDays size={16} />
              {joinedDate}
            </span>
          </div>
        </header>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Total links</p>
              <Link2 className="text-emerald-700" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">{urls.length}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Total clicks</p>
              <MousePointerClick className="text-emerald-700" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">{totalClicks}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Account type</p>
              <UserRound className="text-emerald-700" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold capitalize">{user?.role || "user"}</p>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Your short URLs</h2>
              <p className="mt-1 text-sm text-slate-500">Track links created from your account.</p>
            </div>
            <a
              href="/#shorten"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800"
            >
              Create link
            </a>
          </div>

          {urls.length === 0 ? (
            <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                  <RefreshCw size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950">No short URLs yet</h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">
                  Create your first short link from the landing page and it will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-bold">Destination</th>
                    <th className="px-5 py-3 font-bold">Short link</th>
                    <th className="px-5 py-3 font-bold">Clicks</th>
                    <th className="px-5 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {urls.map((url) => (
                    <tr key={url.id} className="align-top hover:bg-slate-50">
                      <td className="max-w-md px-5 py-4">
                        <a
                          href={url.fullUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate font-semibold text-slate-950 hover:text-emerald-700"
                        >
                          {url.fullUrl}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={url.shortLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-72 items-center gap-2 truncate font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          <span className="truncate">{url.shortLink}</span>
                          <ExternalLink size={16} className="shrink-0" />
                        </a>
                      </td>
                      <td className="px-5 py-4 font-bold">{url.clicks}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(url)}
                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Copy size={16} />
                            {copiedId === url.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default UserDashboard
