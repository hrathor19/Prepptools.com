"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const PLATFORMS = ["Instagram", "Twitter / X", "LinkedIn", "TikTok", "YouTube"];
const COUNTS = [10, 20, 30];

const NICHE_TAGS: Record<string, string[]> = {
  fitness:       ["fitness","workout","gym","fitlife","health","training","motivation","bodybuilding","cardio","weightlifting","healthylifestyle","personaltrainer","fitnessmotivation","exercise","muscle","gains","crossfit","running","yogalife","fitnessgoals"],
  food:          ["foodie","food","instafood","foodphotography","homecooking","recipe","cooking","foodlover","yummy","delicious","foodblogger","healthyfood","mealprep","foodstagram","tasty","kitchen","chef","baking","vegan","eatwell"],
  travel:        ["travel","wanderlust","travelgram","explore","adventure","vacation","instatravel","travelphotography","trip","tourism","backpacker","travelblogger","holiday","destination","sightseeing","globetrotter","roadtrip","traveler","bucket list","nomad"],
  business:      ["business","entrepreneur","startup","marketing","success","leadership","smallbusiness","entrepreneurship","branding","growthhacking","b2b","strategy","businessowner","digitalmarketing","networking","innovation","ceo","founder","hustle","motivation"],
  tech:          ["tech","technology","coding","programming","software","developer","ai","machinelearning","startup","innovation","javascript","python","webdev","cybersecurity","data","cloud","devops","ux","digitalinnovation","futuretech"],
  fashion:       ["fashion","style","ootd","outfitoftheday","fashionblogger","streetstyle","instafashion","fashionista","lookoftheday","outfit","clothes","styling","trendy","wearit","aesthetics","vintagestyle","sustainable","modesty","luxury","editorial"],
  beauty:        ["beauty","makeup","skincare","glam","cosmetics","makeuptutorial","beautytips","skincareroutine","selfcare","glowup","foundation","eyeshadow","lipstick","beautyblogger","naturalbeauty","haircare","nails","brows","antiaging","beautyhacks"],
  photography:   ["photography","photo","photographer","photooftheday","naturephotography","portrait","streetphotography","landscape","lightroom","canon","nikon","sony","aesthetics","goldenHour","blackandwhite","travel","architecture","macro","filmphotography","visualart"],
  education:     ["education","learning","students","study","knowledge","school","university","edtech","onlinelearning","teaching","teacher","studymotivation","lifelong learning","elearning","edchat","classroom","curriculum","stem","scholarship","studytips"],
  realestate:    ["realestate","property","homebuying","realty","housing","investment","forsale","newlisting","homesweethome","realtor","propertyinvestment","dreamhome","interiordesign","architecture","luxuryhomes","rentalproperty","realtorlife","investing","mortgage","homeowner"],
};

function getTagsForTopic(topic: string, platform: string, count: number): string[] {
  const lower = topic.toLowerCase();
  let base: string[] = [];

  for (const [key, tags] of Object.entries(NICHE_TAGS)) {
    if (lower.includes(key) || key.includes(lower)) {
      base = [...tags];
      break;
    }
  }

  if (!base.length) {
    const words = topic.trim().split(/\s+/).filter(Boolean);
    base = words.flatMap(w => [
      w, `${w}life`, `${w}lover`, `${w}community`, `${w}tips`, `${w}goals`,
      `best${w}`, `${w}motivation`, `${w}daily`, `${w}ideas`,
      `love${w}`, `${w}blog`, `${w}content`, `${w}creator`, `${w}style`,
    ]).map(t => t.toLowerCase().replace(/\s+/g, ""));
  }

  const platformExtra: Record<string, string[]> = {
    "Instagram":   ["instagood","instadaily","photooftheday","follow","like","repost","viral","trending","fyp","explore"],
    "Twitter / X": ["trending","viral","thread","breaking","news","discussion","opinion","debate","community","twitter"],
    "LinkedIn":    ["linkedinfam","linkedintips","careeradvice","professionaldevelopment","networking","hiring","leadership","worklife","b2b","growth"],
    "TikTok":      ["fyp","foryou","foryoupage","viral","tiktoktrend","trending","duet","tiktokcommunity","explore","tiktokviral"],
    "YouTube":     ["youtube","youtuber","subscribe","video","vlog","howto","tutorial","shortsvideo","contentcreator","ytshorts"],
  };

  const extra = platformExtra[platform] ?? platformExtra["Instagram"];
  const all = [...new Set([...base, ...extra])].map(t => `#${t}`);

  while (all.length < count) {
    const word = topic.trim().split(/\s+/)[0] ?? "content";
    all.push(`#${word}${all.length}`);
  }

  return all.slice(0, count);
}

export default function AIHashtagGenerator() {
  const [topic, setTopic]       = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [count, setCount]       = useState(20);
  const [tags, setTags]         = useState<string[]>([]);
  const [copied, setCopied]     = useState(false);

  const isReady = topic.trim().length > 0;

  function generate() {
    if (!isReady) return;
    setTags(getTagsForTopic(topic, platform, count));
  }

  function copy() {
    navigator.clipboard.writeText(tags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Topic / Niche</label>
        <input type="text" placeholder="e.g. fitness, travel photography, startup marketing"
          value={topic} onChange={(e) => { setTopic(e.target.value); setTags([]); }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((pl) => (
            <button key={pl} onClick={() => { setPlatform(pl); setTags([]); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${platform === pl ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{pl}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Hashtags</label>
        <div className="flex gap-2">
          {COUNTS.map((c) => (
            <button key={c} onClick={() => { setCount(c); setTags([]); }}
              className={`px-5 py-2 rounded-xl text-sm font-medium border transition-colors ${count === c ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{c}</button>
          ))}
        </div>
      </div>

      <button onClick={generate} disabled={!isReady}
        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Generate Hashtags
      </button>

      {tags.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{tags.length} Hashtags for {platform}</p>
            <div className="flex gap-2">
              <button onClick={generate} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-fuchsia-600 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-fuchsia-600 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy All"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-700 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            Tip: Mix high-volume (#fitness) with mid-tier (#fitnessgoals) and niche (#crossfitcoach) tags for maximum reach.
          </p>
        </div>
      )}
    </div>
  );
}
