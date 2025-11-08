import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Components/api";

export default function MoviesHomePage() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    Type: "Movie",
    Title: "",
    Director: "",
    Budget: "",
    Location: "",
    Duration: "",
    year: "",
    user: "",
  });

  // Fetch user and movie list
  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [meResp, moviesResp] = await Promise.all([
          axios.get("/me/"),
          axios.get("/movies/"),
        ]);
        if (!mounted) return;
        setMe(meResp.data);
        setForm((f) => ({ ...f, user: meResp.data?.id ?? "" }));
        setMovies(Array.isArray(moviesResp.data) ? moviesResp.data : []);
      } catch (err) {
       
        setError(err?.response?.data || err.message || "Failed to load data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.clear();
    setMe(null);
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const resetForm = (keepUser = true) => {
    setEditingId(null);
    setForm({
      Type: "Movie",
      Title: "",
      Director: "",
      Budget: "",
      Location: "",
      Duration: "",
      year: "",
      user: keepUser ? form.user : "",
    });
    setError(null);
  };

  const buildPayload = () => {
    const yearValue = form.year?.toString().trim();
    let normalizedYear = null;
    if (yearValue) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(yearValue)) normalizedYear = yearValue;
      else if (/^\d{4}$/.test(yearValue)) normalizedYear = `${yearValue}-01-01`;
      else {
        const dt = new Date(yearValue);
        if (!isNaN(dt)) {
          const mm = String(dt.getMonth() + 1).padStart(2, "0");
          const dd = String(dt.getDate()).padStart(2, "0");
          normalizedYear = `${dt.getFullYear()}-${mm}-${dd}`;
        }
      }
    }
    return { ...form, year: normalizedYear };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = buildPayload();
      let resp;
      if (editingId) {
        resp = await axios.put(`/movies/${editingId}/`, payload);
        setMovies((prev) =>
          prev.map((m) => (String(m.id) === String(editingId) ? resp.data : m))
        );
      } else {
        resp = await axios.post("/movies/", payload);
        setMovies((prev) => [resp.data, ...prev]);
      }
      resetForm(true);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err.message || "Failed to save entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (m) => {
    setEditingId(m.id);
    setForm({
      Type: m.Type || "Movie",
      Title: m.Title || "",
      Director: m.Director || "",
      Budget: m.Budget || "",
      Location: m.Location || "",
      Duration: m.Duration || "",
      year: m.year ? (m.year.length === 4 ? `${m.year}-01-01` : m.year) : "",
      user: m.user ?? form.user,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await axios.delete(`/movies/${id}/`);
      setMovies((prev) => prev.filter((m) => String(m.id) !== String(id)));
      if (String(editingId) === String(id)) resetForm(true);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err.message || "Failed to delete.");
    }
  };

  const listItems = useMemo(() => {
    const out = Array.isArray(movies) ? [...movies] : [];
    while (out.length < 4) out.push(null);
    return out;
  }, [movies]);

  return (
    <div
      className="min-h-screen text-gray-100 p-4"
      style={{
        background:
          "radial-gradient(circle at top left, #1f2937 0%, #0b1020 70%)",
      }}
    >
      <header className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            🎬 CineVault — Movies & Shows
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {me ? `Signed in as ${me.username || me.email || me.id}` : ""}
          </p>
        </div>
        {me && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/profile/")}
              className=""
            >
            
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Form */}
          <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md rounded-xl p-6 shadow-lg shadow-violet-900/20">
            <h2 className="text-lg font-semibold mb-4 text-violet-400">
              {editingId ? "✏️ Edit Movie" : "➕ Add Movie"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Type</label>
                <select
                  name="Type"
                  value={form.Type}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2"
                >
                  <option value="Movie" className="text-black">Movie</option>
  <option value="Shows" className="text-black">Shows</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Title *
                </label>
                <input
                  name="Title"
                  required
                  value={form.Title}
                  onChange={handleChange}
                  placeholder="Movie Title"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Director
                </label>
                <input
                  name="Director"
                  value={form.Director}
                  onChange={handleChange}
                  placeholder="Director Name"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Budget
                  </label>
                  <input
                    name="Budget"
                    value={form.Budget}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2"
                    placeholder="Budget"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Duration
                  </label>
                  <input
                    name="Duration"
                    value={form.Duration}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2"
                    placeholder="e.g. 2h 30m"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Location
                </label>
                <input
                  name="Location"
                  value={form.Location}
                  onChange={handleChange}
                  placeholder="Filming Location"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">Year</label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  type="date"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">
                  {typeof error === "string"
                    ? error
                    : JSON.stringify(error, null, 2)}
                </p>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-md font-semibold transition"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Add Movie"}
                </button>
                <button
                  type="button"
                  onClick={() => resetForm(true)}
                  className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  {editingId ? "Cancel" : "Reset"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Movie List */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3 text-violet-400">
              🎞 Existing Movies
            </h2>
            <div className="bg-gray-900/80 border border-gray-700 rounded-xl shadow-lg shadow-violet-900/20 overflow-hidden">
              <div
                className="divide-y divide-gray-700 overflow-y-auto"
                style={{ maxHeight: "520px" }}
              >
                {loading ? (
                  <div className="p-4 text-center text-gray-400">
                    Loading movies...
                  </div>
                ) : (
                  listItems.map((m, idx) =>
                    m ? (
                      <div
                        key={m.id}
                        className="p-4 flex items-start justify-between hover:bg-gray-800 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">
                              {m.Title}
                            </span>
                            {m.year && (
                              <span className="text-xs text-gray-400">
                                ({m.year})
                              </span>
                            )}
                            <span className="ml-2 text-xs bg-violet-700/20 text-violet-300 px-2 py-0.5 rounded-full">
                              {m.Type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Director: {m.Director || "—"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {m.Location || "—"} • {m.Duration || "—"} •{" "}
                            {m.Budget || "—"}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(m)}
                            className="px-3 py-1 text-sm border border-gray-600 rounded text-gray-200 hover:bg-gray-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="px-3 py-1 text-sm border border-red-600 text-red-400 rounded hover:bg-red-900/20"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={`placeholder-${idx}`}
                        className="p-4 text-gray-600 text-sm opacity-40"
                      >
                        — Empty Slot —
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
