"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Layers,
  MapPin,
  PanelLeftClose,
  Sparkles,
  RotateCcw,
  Info,
} from "lucide-react";
import { sites } from "@/lib/sites";
const SiteMap = dynamic(() => import("@/components/site-map"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading Singapore map…</div>,
});
const greetings = {
  officer:
    "Greetings. I am the InterimPop portal. Please state your proposed temporary land use so we may check it against Master Plan zoning guidelines.",
  hustler:
    "Yo! Ready to set up shop? Tell me what kind of event you're running and I'll find you a spot before SCDF even notices.",
};
const prompts = [
  "Find a site for a 3-day weekend farmers market in the East.",
  "What are the TOL fees for a 500sqm outdoor event space?",
  "Show me sites near high-density residential areas.",
];
type Message = { role: "user" | "assistant"; text: string };
export default function Dashboard() {
  const [hustler, setHustler] = useState(false),
    [messages, setMessages] = useState<Message[]>([]),
    [input, setInput] = useState(""),
    [selected, setSelected] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null),
    field = useRef<HTMLInputElement>(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  function send(text: string) {
    if (!text.trim()) return;
    let response = "";
    const lower = text.toLowerCase();
    if (lower.includes("market") && lower.includes("east")) {
      setSelected("BD-003");
      response = hustler
        ? "Found a killer 600sqm spot in Bedok. High Auntie Footfall Index from the nearby wet market, meaning crazy morning traffic. Rent is just $2,160 for the weekend ($1.20 psm/day). Keep the fire lanes clear so you don't get fined. Want me to draft the pitch deck?"
        : "A 600sqm vacant parcel in Bedok has been identified. It complies with URA zoning for community events. Based on the 2026 SLA TOL rate table for non-commercial community use ($1.20 psm/day), a 3-day licence will incur a fee of $2,160. Note: SCDF fire safety clearance is required. Shall I generate the Form C application?";
      response +=
        "\n\nDemo scenario only: parcel availability, zoning compliance, rate table, and application forms are illustrative and unverified. Confirm current requirements with SLA, URA and SCDF.";
    } else if (
      lower.includes("draft") ||
      lower.includes("form c") ||
      lower === "yes"
    ) {
      const site =
        sites.find((s) => lower.includes(s.id.toLowerCase())) ||
        sites.find((s) => s.id === selected);
      response = site
        ? `APPLICATION WORKING DRAFT — ${site.id}\n\nLocation: ${site.name}\nArea: ${site.area} m²\nProposed use: [describe event]\nDates and duration: [confirm dates]\nApplicant / contact: [add details]\nAttendance and operating hours: [add details]\nSafety, access and waste management: [attach plan]\n\nIndicative example for 3 days: ${site.area} × $1.20 × 3 = $${(site.area * 1.2 * 3).toLocaleString("en-SG")}.\n\nThis is a planning draft, not an official form or submission. Confirm permissions, rates and required documents with the relevant authorities.`
        : "Select a site on the map or in the parcel list first, then I can prepare an illustrative application draft.";
    } else if (lower.includes("fee") || lower.includes("cost")) {
      response =
        "For the 500 m² example, using our illustrative $1.20/m²/day rate:\n\n500 × $1.20 = $600 per day\n3 days = $1,800\n\nThis is a demo calculation, not an official SLA quote. Actual rent, deposits, taxes and approvals may differ. Tell me the parcel and duration to explore your scenario.";
    } else if (lower.includes("residential")) {
      setSelected("BD-003");
      response =
        "Explore Bedok North: our mock 600 m² parcel sits in an illustrative residential catchment with an Auntie Footfall Index of 8.5/10. Kallang is another option for weekend activity. Select a parcel to inspect its details. These insights are fictional, not measured footfall data.";
    } else
      response = hustler
        ? "Big idea energy! Try a farmers market in the East, ask about TOL fees, or pick a plot and I’ll draft a plan. This prototype uses three sample sites and scripted responses."
        : "Please specify a site, event type, or indicative fee question. This prototype supports East-side market matching, example fee calculations, residential site discovery and application drafts.";
    setMessages((m) => [
      ...m,
      { role: "user", text: text.trim() },
      { role: "assistant", text: response },
    ]);
    setInput("");
  }
  return (
    <main className="dashboard">
      <header className="dashboard-nav">
        <Link className="logo" href="/">
          <span className="logo-mark">
            <Layers size={20} />
          </span>
          Interim<span>Pop</span>
          <i>CO-PILOT</i>
        </Link>
        <div className="dashboard-nav-right">
          <span className="demo-tag">HACKATHON DEMO</span>
          <Link href="/">
            Back to home <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>
      <div className="workspace">
        <section className="map-pane" aria-label="Singapore site map">
          <div className="map-toolbar">
            <div>
              <span className="live-dot" /> SINGAPORE{" "}
              <span className="muted">/</span> AVAILABLE SPACES
            </div>
            <button
              onClick={() => setSelected(null)}
              aria-label="Reset map view"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          <SiteMap
            selected={selected}
            onSelect={(id) => {
              setSelected(id);
              setInput(`Draft an application for Site ${id}`);
              field.current?.focus();
            }}
          />
          <div className="map-overlay">
            <span className="eyebrow">A PLACE FOR YOUR NEXT IDEA</span>
            <h2>
              {selected
                ? sites.find((s) => s.id === selected)?.name
                : "Find your little corner."}
            </h2>
            <p>3 illustrative parcels. Endless possibilities.</p>
          </div>
          <div className="parcel-list">
            {sites.map((s) => (
              <button
                key={s.id}
                className={`parcel-card ${selected === s.id ? "active" : ""}`}
                onClick={() => setSelected(s.id)}
              >
                <MapPin size={18} />
                <span>
                  <small>{s.district}</small>
                  <strong>{s.name}</strong>
                  <small>
                    {s.area} m² · {s.id}
                  </small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
          <div className="map-legend">
            <span /> Sample land parcels <b>•</b> Boundaries are illustrative
          </div>
        </section>
        <section className="chat-pane" aria-label="AI co-pilot">
          <header className="chat-header">
            <div className="assistant-title">
              <span className="assistant-icon">
                <Sparkles size={19} />
              </span>
              <div>
                <h1>InterimPop Assistant</h1>
                <p>
                  <span className="live-dot" /> Your idea. Let’s find its place.
                </p>
              </div>
            </div>
            <div className="tone-row">
              <span>CHOOSE YOUR CO-PILOT</span>
              <div className="tone-control">
                <span className={!hustler ? "chosen" : ""}>SLA Officer</span>
                <button
                  role="switch"
                  aria-checked={hustler}
                  aria-label="Pop-up Hustler mode"
                  onClick={() => setHustler((h) => !h)}
                >
                  <span className={hustler ? "on" : ""} />
                </button>
                <span className={hustler ? "chosen" : ""}>Pop-up Hustler</span>
              </div>
            </div>
          </header>
          <div className="chat-history" role="log" aria-live="polite">
            <div className="chat-date">LET’S MAKE SPACE FOR SOMETHING GOOD</div>
            <div className="message assistant">
              <span className="message-avatar">
                <Sparkles size={16} />
              </span>
              <div>
                <small>
                  INTERIMPOP · {hustler ? "THE HUSTLER" : "SLA OFFICER"}
                </small>
                <p>{hustler ? greetings.hustler : greetings.officer}</p>
              </div>
            </div>
            {messages.map((m, i) => (
              <div className={`message ${m.role}`} key={i}>
                {m.role === "assistant" && (
                  <span className="message-avatar">
                    <Sparkles size={16} />
                  </span>
                )}
                <div>
                  <small>{m.role === "user" ? "YOU" : "INTERIMPOP"}</small>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="chat-intro">
                <span>
                  <MapPin size={22} />
                </span>
                <h2>
                  A farmers market?
                  <br />
                  An outdoor movie night?
                </h2>
                <p>Start with a spark. We’ll help with the space.</p>
              </div>
            )}
            <div ref={bottom} />
          </div>
          <div className="chat-bottom">
            <div className="prompt-list">
              {prompts.map((p, i) => (
                <button key={p} onClick={() => send(p)}>
                  <span>{["🥬", "↗", "⌖"][i]}</span>
                  {p}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                ref={field}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Message InterimPop"
                placeholder="Tell us what you have in mind…"
              />
              <button disabled={!input.trim()} aria-label="Send message">
                <ArrowUp size={20} />
              </button>
            </form>
            <p className="chat-disclaimer">
              <Info size={12} /> Demo responses & indicative costs. Verify with
              SLA before applying.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
