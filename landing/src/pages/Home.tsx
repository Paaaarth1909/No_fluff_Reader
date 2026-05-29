import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ArrowRight, EyeOff, Highlighter, Clock, Activity, Settings2, ShieldCheck, Download, Check, Code, GitMerge, Cpu, Terminal, Moon, Sun } from "lucide-react";
import heroImg from "@/assets/hero.png";
import hideImg from "@/assets/hide.png";
import highlightImg from "@/assets/highlight.png";

const CHROME_WEB_STORE_URL = import.meta.env.VITE_CHROME_WEB_STORE_URL as string | undefined;
const EXTENSION_DOWNLOAD_URL =
  (import.meta.env.VITE_EXTENSION_DOWNLOAD_URL as string | undefined) ?? "/no-fluff-reader.zip";
const HAS_WEB_STORE_URL = Boolean(CHROME_WEB_STORE_URL);

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openInstall = () => {
    if (CHROME_WEB_STORE_URL) {
      window.open(CHROME_WEB_STORE_URL, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(EXTENSION_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
    scrollToSection("install");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <span className="font-medium tracking-wide text-sm">No-Fluff Reader</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground hidden sm:block">Chrome Extension</span>
            <Button
              type="button"
              size="sm"
              onClick={openInstall}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Add to Chrome
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              title="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border border-white/10"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              v2.0 Now Available
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.1] mb-6">
              Radical focus.<br />
              <span className="text-muted-foreground">Zero noise.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed font-light">
              A precision instrument for the focused mind. Hide the hot takes, highlight the signal, and reclaim your attention on the web. Built for engineers who are exhausted by the noise.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <Button
                type="button"
                size="lg"
                onClick={openInstall}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12"
              >
                <Download className="w-4 h-4 mr-2" />
                Install Extension
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("manifesto")}
                className="rounded-full border-white/10 hover:bg-white/5 h-12 px-8"
              >
                Read the manifesto
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 relative rounded-xl border border-white/10 overflow-hidden bg-white/5 shadow-2xl shadow-primary/5"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img src={heroImg} alt="No-Fluff Reader Interface" className="w-full h-auto object-cover opacity-90" />
          </motion.div>
        </div>
      </section>

      {/* 2. The Problem */}
      <section id="manifesto" className="py-24 px-6 border-t border-white/5 bg-black/20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-serif mb-6">
                The web is broken.<br />We're fixing your view of it.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-6 leading-relaxed">
                Every platform is incentivized to serve you engagement bait. Hot takes, AI generated filler, and outrage dominate your feeds.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                No-Fluff Reader acts as a client-side firewall. It evaluates DOM mutations in real-time, instantly excising elements that match your block rules before they even render.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-xl"
            >
              <img src={hideImg} alt="Filtering noise" className="object-cover w-full h-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Core Features */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-serif mb-6">A scalpel for your attention.</h2>
            <p className="text-muted-foreground text-lg">Define exactly what you want to see, and exactly what you don't. The extension handles the rest with zero latency.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<EyeOff className="w-5 h-5 text-primary" />}
              title="Surgical Hiding"
              description="Define regex or keyword rules to instantly display:none any container matching clickbait or low-effort content."
            />
            <FeatureCard 
              icon={<Highlighter className="w-5 h-5 text-primary" />}
              title="Signal Highlighting"
              description="Surface high-value terms (e.g. 'case study', 'post-mortem'). The extension subtly elevates these containers."
            />
            <FeatureCard 
              icon={<Activity className="w-5 h-5 text-primary" />}
              title="Real-time Detection"
              description="Built on MutationObserver API to catch and filter lazy-loaded content in SPAs instantly without layout shift."
            />
            <FeatureCard 
              icon={<Clock className="w-5 h-5 text-primary" />}
              title="Reading Queue"
              description="Found a dense technical article? One click saves it to a clean, offline-ready local reading queue."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-5 h-5 text-primary" />}
              title="Daily Limits"
              description="Set intentional limits on specific domains. When you hit your cap, the page gently fades to black."
            />
            <FeatureCard 
              icon={<Settings2 className="w-5 h-5 text-primary" />}
              title="Global Toggle"
              description="Need to see the chaos? A keyboard shortcut instantly disables all rules and restores the original DOM."
            />
          </div>
        </div>
      </section>

      {/* 4. Deep Dive / Highlight */}
      <section className="py-24 px-6 border-t border-white/5 bg-black/20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 md:order-last shadow-xl"
            >
              <img src={highlightImg} alt="Highlighting signal" className="object-cover w-full h-full" />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-serif mb-6">
                Train it to find the gold.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-6 leading-relaxed">
                You know what valuable content looks like in your field. Configure your positive rules, and the extension will scan every page to find it.
              </motion.p>
              <motion.ul variants={fadeUp} className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Subtle visual elevation for matching elements</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Customizable CSS injection for highlights</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Share and import rule configurations via JSON</span>
                </li>
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. How it Works (Technical) */}
      <section id="install" className="py-32 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif mb-6">Under the hood.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Engineered for absolute minimum overhead. No external network requests during page load. Zero analytics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl border border-white/5 bg-white/[0.02]">
              <Terminal className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">Fast DOM Traversal</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Uses highly optimized querySelectorAll and MutationObserver patterns to evaluate nodes efficiently without freezing the main thread.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-white/5 bg-white/[0.02]">
              <Cpu className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">Local Processing Only</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All regex evaluation happens entirely locally. Your browsing history and rules never leave your device.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-white/5 bg-white/[0.02]">
              <Code className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">Shadow DOM Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Traverses open shadow roots to filter content inside web components on modern platforms.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-white/5 bg-white/[0.02]">
              <GitMerge className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">Regex Rule Engine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Define rules with full PCRE support. Target specific attributes, text content, or URL patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonial / Social Proof */}
      <section className="py-24 px-6 border-t border-white/5 bg-black/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <svg className="w-8 h-8 mx-auto text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-light leading-relaxed mb-8">
              "The single highest ROI tool in my workflow. It completely changes the signal-to-noise ratio of reading on the internet. I forget it's there until I use someone else's computer."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-medium">JD</div>
              <div className="text-left">
                <div className="font-medium text-sm">Senior Staff Engineer</div>
                <div className="text-xs text-muted-foreground">San Francisco, CA</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. Setup / Workflow */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif mb-6">Configured in minutes.</h2>
            <p className="text-muted-foreground text-lg">Simple JSON configuration that you can version control.</p>
          </div>

          <div className="bg-[#0a0a0c] rounded-xl border border-white/10 p-6 font-mono text-sm overflow-x-auto shadow-2xl">
            <pre className="text-muted-foreground">
              <code className="text-[#a5b4fc]">{`{`}</code><br />
              <code>  <span className="text-[#93c5fd]">"hideRules"</span>: [</code><br />
              <code>    <span className="text-[#86efac]">"10 things you need to know"</span>,</code><br />
              <code>    <span className="text-[#86efac]">"/AI.*hype/i"</span>,</code><br />
              <code>    <span className="text-[#86efac]">"thread 🧵"</span></code><br />
              <code>  ],</code><br />
              <code>  <span className="text-[#93c5fd]">"highlightRules"</span>: [</code><br />
              <code>    <span className="text-[#86efac]">"post-mortem"</span>,</code><br />
              <code>    <span className="text-[#86efac]">"architecture review"</span>,</code><br />
              <code>    <span className="text-[#86efac]">"benchmarks"</span></code><br />
              <code>  ],</code><br />
              <code>  <span className="text-[#93c5fd]">"dailyLimits"</span>: {`{`}</code><br />
              <code>    <span className="text-[#86efac]">"news.ycombinator.com"</span>: <span className="text-[#fca5a5]">15</span></code><br />
              <code>  {`}`}</code><br />
              <code className="text-[#a5b4fc]">{`}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif mb-6">Reclaim your digital environment.</h2>
            <p className="text-xl text-muted-foreground mb-10 font-light">
              Stop letting algorithms dictate your attention. Install the extension and curate your own reality.
            </p>
            <Button
              type="button"
              size="lg"
              onClick={openInstall}
              className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-lg font-medium"
            >
              {HAS_WEB_STORE_URL ? "Add to Chrome — It's Free" : "Download Extension ZIP"}
            </Button>
            {!HAS_WEB_STORE_URL ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Then open chrome://extensions, enable Developer mode, and load unpacked from extension/dist.
              </p>
            ) : null}
            <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Check className="w-3 h-3 text-primary" /> No tracking
              <span className="mx-2 opacity-30">•</span>
              <Check className="w-3 h-3 text-primary" /> No analytics
              <span className="mx-2 opacity-30">•</span>
              <Check className="w-3 h-3 text-primary" /> Open source
            </p>
          </motion.div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-sm text-muted-foreground bg-black/40">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/50" />
              <span className="font-medium text-foreground/80">No-Fluff Reader</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-foreground transition-colors">Manifesto</a>
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            </div>
          </div>
          <div className="mt-8 text-center md:text-left text-xs opacity-50">
            &copy; {new Date().getFullYear()} No-Fluff Reader. Crafted with focus.
          </div>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={fadeUp}
      className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
