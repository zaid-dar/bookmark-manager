import { useEffect, useMemo, useState } from "react";
import "./App.css";

const defaultShows = [
    {
        id: 1,
        title: "The Expanse",
        platform: "Prime Video",
        status: "Watching",
    },
    {
        id: 2,
        title: "Breaking Bad",
        platform: "Netflix",
        status: "Watched",
    },
    {
        id: 3,
        title: "Severance",
        platform: "Apple TV+",
        status: "To Watch",
    },
];

export default function App() {
    const [shows, setShows] = useState(() => {
        const stored = localStorage.getItem("tvBookmarks");
        if (!stored) return defaultShows;
        try {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : defaultShows;
        } catch {
            return defaultShows;
        }
    });
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("Netflix");
    const [status, setStatus] = useState("To Watch");

    const stats = useMemo(() => {
        const total = shows.length;
        const watched = shows.filter((show) => show.status === "Watched").length;
        const watching = shows.filter((show) => show.status === "Watching").length;
        const toWatch = total - watched - watching;
        return { total, watched, watching, toWatch };
    }, [shows]);

    useEffect(() => {
        localStorage.setItem("tvBookmarks", JSON.stringify(shows));
    }, [shows]);

    function addShow(event) {
        event.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        const newShow = {
            id: Date.now(),
            title: trimmedTitle,
            platform,
            status,
        };

        setShows((prev) => [newShow, ...prev]);
        setTitle("");
        setPlatform("Netflix");
        setStatus("To Watch");
    }

    function updateStatus(id, nextStatus) {
        setShows((prev) => prev.map((show) => (show.id === id ? { ...show, status: nextStatus } : show)));
    }

    function removeShow(id) {
        setShows((prev) => prev.filter((show) => show.id !== id));
    }

    return (
        <div className="app">
            <header className="hero">
                <p className="eyebrow">Tiny Bookmark Manager</p>
                <h1>TV Show Bookmarks</h1>
                <p className="subtitle">
                    Keep a lightweight list of what you want to watch next. Add shows, mark progress, and clean up when
                    you're done.
                </p>
            </header>

            <section className="stats">
                <div className="stat">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">To Watch</span>
                    <span className="stat-value">{stats.toWatch}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Watching</span>
                    <span className="stat-value">{stats.watching}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Watched</span>
                    <span className="stat-value">{stats.watched}</span>
                </div>
            </section>

            <form className="add-form" onSubmit={addShow}>
                <div className="field">
                    <label htmlFor="title">Show title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="e.g. Arcane"
                    />
                </div>
                <div className="field">
                    <label htmlFor="platform">Platform</label>
                    <select
                        id="platform"
                        value={platform}
                        onChange={(event) => setPlatform(event.target.value)}
                    >
                        <option>Netflix</option>
                        <option>Prime Video</option>
                        <option>Apple TV+</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="status">Status</label>
                    <select id="status" value={status} onChange={(event) => setStatus(event.target.value)}>
                        <option>To Watch</option>
                        <option>Watching</option>
                        <option>Watched</option>
                    </select>
                </div>
                <button className="primary" type="submit">
                    Add Bookmark
                </button>
            </form>

            <section className="list">
                {shows.length === 0 ? (
                    <p className="empty">Nothing here yet. Add your first show above.</p>
                ) : (
                    shows.map((show) => (
                        <article className="card" key={show.id}>
                            <div>
                                <h2>{show.title}</h2>
                                <p className="meta">{show.platform}</p>
                            </div>
                            <div className="card-actions">
                                <span className={`badge badge-${show.status.replace(" ", "").toLowerCase()}`}>
                                    {show.status}
                                </span>
                                <div className="buttons">
                                    {show.status !== "Watched" ? (
                                        <button type="button" onClick={() => updateStatus(show.id, "Watched")}>
                                            Mark Watched
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => updateStatus(show.id, "To Watch")}>
                                            Rewatch Later
                                        </button>
                                    )}
                                    <button type="button" className="ghost" onClick={() => removeShow(show.id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </section>
        </div>
    );
}
