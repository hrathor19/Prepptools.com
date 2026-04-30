"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const PLATFORMS = ["Google Ads", "Facebook", "Instagram", "LinkedIn"];
const TONES = ["Professional", "Casual", "Urgent", "Inspiring", "Humorous"];

type AdCopy = { headline: string; body: string; cta: string };

function generate(product: string, audience: string, benefit: string, platform: string, tone: string): AdCopy {
  const p = product.trim() || "our product";
  const a = audience.trim() || "professionals";
  const b = benefit.trim() || "save time and grow faster";

  const headlines: Record<string, Record<string, string>> = {
    "Google Ads": {
      Professional: `${p} — The Smarter Choice for ${a}`,
      Casual:       `Finally, a ${p} That Gets You`,
      Urgent:       `Limited Time: Get ${p} Before It's Gone`,
      Inspiring:    `Transform the Way ${a} Work with ${p}`,
      Humorous:     `${p}: Because ${a} Deserve Better`,
    },
    "Facebook": {
      Professional: `Why ${a} Are Switching to ${p}`,
      Casual:       `Hey ${a} — this is the ${p} you've been looking for 👀`,
      Urgent:       `⚡ Only 48 Hours Left — Get ${p} Now`,
      Inspiring:    `${a}: Your journey to ${b} starts here.`,
      Humorous:     `Tired of the struggle? ${p} has entered the chat.`,
    },
    "Instagram": {
      Professional: `Elevate your results with ${p}. ✨`,
      Casual:       `No cap — ${p} actually helps you ${b} 🙌`,
      Urgent:       `Flash Sale on ${p} — ends tonight 🔥`,
      Inspiring:    `Big goals deserve the right tools. Meet ${p}. 💫`,
      Humorous:     `${p}: The glow-up you didn't know you needed 😂`,
    },
    "LinkedIn": {
      Professional: `${p}: Built for ${a} Who Demand Results`,
      Casual:       `Real talk — ${p} helped us ${b}. Here's how.`,
      Urgent:       `Seats are filling fast. Join ${a} using ${p} today.`,
      Inspiring:    `The best ${a} don't just work harder — they use ${p}.`,
      Humorous:     `${p}: Helping ${a} look good since day one.`,
    },
  };

  const bodies: Record<string, Record<string, string>> = {
    "Google Ads": {
      Professional: `${p} is purpose-built to help ${a} ${b}. Trusted by thousands. No hidden fees. Start in minutes.`,
      Casual:       `Looking to ${b}? ${p} makes it stupid simple. Try it free today.`,
      Urgent:       `Don't miss out — ${a} are already using ${p} to ${b}. Act now before the offer expires.`,
      Inspiring:    `Imagine what you could achieve if you could ${b}. ${p} makes that a reality for ${a} every day.`,
      Humorous:     `Sure, you could keep doing things the hard way. Or you could try ${p} and actually ${b}.`,
    },
    "Facebook": {
      Professional: `Join thousands of ${a} who rely on ${p} to ${b}. Easy setup. Real results. Try free for 14 days.`,
      Casual:       `We built ${p} because we were tired of the same old tools. If you want to ${b}, this is it.`,
      Urgent:       `This deal won't last. ${a} who grab ${p} today lock in the best price — forever. Don't wait.`,
      Inspiring:    `Every ${a} who uses ${p} discovers a new way to ${b}. What are you waiting for?`,
      Humorous:     `Plot twist: ${b} doesn't have to be hard. ${p} takes care of the messy parts so you don't have to.`,
    },
    "Instagram": {
      Professional: `${a} trust ${p} to ${b} — consistently, effortlessly. Link in bio to learn more.`,
      Casual:       `If your goal is to ${b}, then ${p} is literally made for you. Swipe up to see how it works!`,
      Urgent:       `Our ${p} promo is live for the next 24 hours only. Tap the link, grab the deal, thank yourself later. ⏰`,
      Inspiring:    `You already have the ambition. ${p} gives you the edge. Time to ${b} like never before. ✨`,
      Humorous:     `Warning: Using ${p} may cause unexpected ${b}, spontaneous success, and mild jealousy from competitors. 😅`,
    },
    "LinkedIn": {
      Professional: `${p} was designed with ${a} in mind. Our platform helps teams ${b} without complexity or overhead. Book a demo.`,
      Casual:       `Here's the thing — most ${a} are leaving results on the table. ${p} helps you ${b}. Simple as that.`,
      Urgent:       `We are opening only 50 new accounts this quarter. If you are a ${a} looking to ${b}, apply now.`,
      Inspiring:    `The top-performing ${a} share one thing in common: they invest in the right tools. ${p} is one of them.`,
      Humorous:     `My boss said "find a way to ${b}." I said "I already did — it's called ${p}." True story.`,
    },
  };

  const ctas: Record<string, Record<string, string>> = {
    "Google Ads":  { Professional: "Start Free Trial", Casual: "Try It Free", Urgent: "Claim Offer Now", Inspiring: "Get Started Today", Humorous: "Give It a Go" },
    "Facebook":    { Professional: "Learn More", Casual: "See How It Works", Urgent: "Grab the Deal", Inspiring: "Join the Movement", Humorous: "Okay, Fine. Let's Go." },
    "Instagram":   { Professional: "Link in Bio", Casual: "Swipe Up ☝️", Urgent: "Shop Now 🛒", Inspiring: "Start the Journey ✨", Humorous: "Do It. Trust Me. 😂" },
    "LinkedIn":    { Professional: "Request a Demo", Casual: "Let's Connect", Urgent: "Apply Now", Inspiring: "Join Today", Humorous: "Click. You Know You Want To." },
  };

  return {
    headline: headlines[platform]?.[tone] ?? headlines["Google Ads"]["Professional"],
    body:     bodies[platform]?.[tone]     ?? bodies["Google Ads"]["Professional"],
    cta:      ctas[platform]?.[tone]       ?? "Get Started",
  };
}

export default function AIAdCopyGenerator() {
  const [product, setProduct]   = useState("");
  const [audience, setAudience] = useState("");
  const [benefit, setBenefit]   = useState("");
  const [platform, setPlatform] = useState("Google Ads");
  const [tone, setTone]         = useState("Professional");
  const [result, setResult]     = useState<AdCopy | null>(null);
  const [copied, setCopied]     = useState(false);

  const isReady = product && audience && benefit;

  function handleGenerate() {
    if (!isReady) return;
    setResult(generate(product, audience, benefit, platform, tone));
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(`Headline: ${result.headline}\n\n${result.body}\n\nCTA: ${result.cta}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product / Service Name</label>
          <input type="text" placeholder="e.g. TaskFlow, a project management app"
            value={product} onChange={(e) => { setProduct(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Audience</label>
          <input type="text" placeholder="e.g. startup founders, freelance designers"
            value={audience} onChange={(e) => { setAudience(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Key Benefit</label>
        <input type="text" placeholder="e.g. save 5 hours a week, close deals 2x faster"
          value={benefit} onChange={(e) => { setBenefit(e.target.value); setResult(null); }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((pl) => (
            <button key={pl} onClick={() => { setPlatform(pl); setResult(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${platform === pl ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{pl}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button key={t} onClick={() => { setTone(t); setResult(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${tone === t ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{t}</button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!isReady}
        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Generate Ad Copy
      </button>

      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Your {platform} Ad Copy</p>
            <div className="flex gap-2">
              <button onClick={handleGenerate} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-fuchsia-600 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-fuchsia-600 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy All"}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-fuchsia-600 mb-1 uppercase tracking-wide">Headline</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{result.headline}</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-fuchsia-600 mb-1 uppercase tracking-wide">Body Copy</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{result.body}</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-fuchsia-600 mb-1 uppercase tracking-wide">Call to Action</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{result.cta}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            Tip: A/B test the headline and CTA — small tweaks often produce 20–40% better click-through rates.
          </p>
        </div>
      )}
    </div>
  );
}
