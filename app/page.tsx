"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Map,
  Calculator,
  Users,
  Sparkles,
  Layers,
  Check,
  MoveUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <main className="landing">
      <nav className="nav">
        <Link href="/" className="logo">
          <span className="logo-mark">
            <Layers size={21} />
          </span>
          Interim<span>Pop</span>
          <i>SG</i>
        </Link>
        <div className="nav-links">
          <a href="#features">Why InterimPop</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            Launch Co-Pilot <ArrowUpRight size={16} />
          </Link>
        </Button>
      </nav>
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="hero-copy"
        >
          <div className="eyebrow">
            <span /> BIG IDEAS. UNDERUSED SPACES.
          </div>
          <h1>
            Activate vacant
            <br />
            state land.
            <br />
            <em>In seconds.</em>
          </h1>
          <p className="hero-description">
            Activate vacant state land in seconds. Your AI co-pilot for finding
            the right space, making sense of the paperwork, and bringing your
            next big idea to life.
          </p>
          <div className="hero-actions">
            <Button asChild>
              <Link href="/dashboard">
                Find your site <ArrowUpRight size={19} />
              </Link>
            </Button>
            <a className="text-link" href="#how">
              See how it works <ArrowRight size={16} />
            </a>
          </div>
          <div className="hero-proof">
            <span className="avatar">SQ</span>
            <span className="avatar second">JL</span>
            <span className="avatar third">AT</span>
            <div>
              Made for Singapore’s doers.
              <br />
              <strong>From “what if” to “right here”.</strong>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="hero-visual"
        >
          <div className="visual-top">
            <span>
              <span className="live-dot" /> YOUR NEXT BIG THING STARTS HERE
            </span>
            <Layers size={17} />
          </div>
          <div className="abstract-map">
            <div className="water" />
            <div className="road r1" />
            <div className="road r2" />
            <div className="road r3" />
            <div className="road r4" />
            <span className="map-label l1">BEDOK NORTH</span>
            <span className="map-label l2">KAKI BUKIT</span>
            <span className="map-label l3">BEDOK RESERVOIR</span>
            <div className="plot">
              <MapPin size={26} />
              <span>Room for your next idea.</span>
            </div>
            <span className="map-compass">N ↑</span>
          </div>
          <div className="site-preview">
            <div className="site-icon">
              <MapPin size={23} />
            </div>
            <div>
              <small>IT’S A MATCH</small>
              <h3>Bedok North</h3>
              <p>
                600 m² <span>•</span> Community & pop-up events
              </p>
            </div>
            <Link href="/dashboard" aria-label="Explore Bedok North">
              <MoveUpRight size={22} />
            </Link>
          </div>
          <div className="floating-note">
            <Sparkles size={17} />
            <span>Less red tape. More possibilities.</span>
          </div>
        </motion.div>
      </section>
      <div className="trust-strip">
        <span>A LITTLE SPACE CAN MAKE A BIG DIFFERENCE</span>
        <div>
          <Check size={16} /> Singapore-focused
        </div>
        <div>
          <Check size={16} /> Built for temporary use
        </div>
        <div>
          <Check size={16} /> Ideas of every size
        </div>
      </div>
      <section id="features" className="features">
        <div className="section-head">
          <div>
            <div className="eyebrow">THE SPACE BETWEEN IDEA & REALITY</div>
            <h2>Big plans. Small paperwork.</h2>
          </div>
          <p>
            You bring the vision.
            <br />
            We help you find the ground for it.
          </p>
        </div>
        <div className="feature-grid">
          {[
            {
              icon: Map,
              title: "The right place, faster.",
              label: "01 / GEOSPATIAL MATCHING",
              body: "Discover spaces that fit your idea. Explore locations, land sizes, and neighbourhoods on one interactive map.",
            },
            {
              icon: Calculator,
              title: "Know your numbers.",
              label: "02 / INSTANT TOL COSTING",
              body: "Turn square metres and dates into clear indicative costs. Less spreadsheet gymnastics. More getting started.",
            },
            {
              icon: Users,
              title: "A little local wisdom.",
              label: "03 / HYPER-LOCAL INSIGHTS",
              body: "Meet the Auntie Footfall Index. Get a playful feel for the neighbourhood, from morning crowds to curious otters.",
            },
          ].map((f) => (
            <article key={f.label}>
              <div className="feature-icon">
                <f.icon size={23} />
              </div>
              <small>{f.label}</small>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <Link href="/dashboard">
                Explore the co-pilot <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section id="how" className="how">
        <div>
          <div className="eyebrow">FROM EMPTY PLOT TO FULL POTENTIAL</div>
          <h2>
            Your next chapter
            <br />
            needs a place.
          </h2>
        </div>
        <div className="steps">
          {[
            "Tell us what you’re dreaming up.",
            "Find a space that fits.",
            "Explore costs. Draft your application.",
          ].map((s, i) => (
            <div key={s}>
              <span>0{i + 1}</span>
              {s}
              <ArrowUpRight size={18} />
            </div>
          ))}
        </div>
      </section>
      <section id="pricing" className="closing">
        <div>
          <Sparkles size={22} />
          <h2>A fresh idea deserves a little space.</h2>
          <p>Free to explore. Built as an SLA hackathon prototype.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard">
            Let’s make it happen <ArrowUpRight size={18} />
          </Link>
        </Button>
      </section>
      <footer>
        <Link href="/" className="logo">
          <Layers size={20} /> InterimPop
        </Link>
        <span>Made for the spaces in between.</span>
        <small>
          © {new Date().getFullYear()} InterimPop · SLA Hackathon Demo
        </small>
      </footer>
    </main>
  );
}
