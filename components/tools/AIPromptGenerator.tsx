"use client";

import { useState } from "react";
import { Copy, Check, Wand2 } from "lucide-react";

type Platform = "chatgpt" | "claude" | "midjourney" | "dalle" | "gemini" | "stable-diffusion";
type Tone = "professional" | "casual" | "creative" | "academic" | "persuasive" | "humorous";
type Format = "paragraph" | "bullet-points" | "step-by-step" | "table" | "email" | "blog-post";
type Length = "short" | "medium" | "detailed";
type ImageStyle = "photorealistic" | "digital-art" | "oil-painting" | "watercolor" | "anime" | "3d-render" | "sketch" | "cinematic";

const isImagePlatform = (p: Platform) => ["midjourney", "dalle", "stable-diffusion"].includes(p);

const platforms: { id: Platform; label: string; emoji: string }[] = [
  { id: "chatgpt", label: "ChatGPT", emoji: "🤖" },
  { id: "claude", label: "Claude", emoji: "🧠" },
  { id: "gemini", label: "Gemini", emoji: "✨" },
  { id: "midjourney", label: "Midjourney", emoji: "🎨" },
  { id: "dalle", label: "DALL·E", emoji: "🖼️" },
  { id: "stable-diffusion", label: "Stable Diffusion", emoji: "🌀" },
];

const tones: { id: Tone; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "creative", label: "Creative" },
  { id: "academic", label: "Academic" },
  { id: "persuasive", label: "Persuasive" },
  { id: "humorous", label: "Humorous" },
];

const formats: { id: Format; label: string }[] = [
  { id: "paragraph", label: "Paragraph" },
  { id: "bullet-points", label: "Bullet Points" },
  { id: "step-by-step", label: "Step-by-Step" },
  { id: "table", label: "Table" },
  { id: "email", label: "Email" },
  { id: "blog-post", label: "Blog Post" },
];

const imageStyles: { id: ImageStyle; label: string }[] = [
  { id: "photorealistic", label: "Photorealistic" },
  { id: "digital-art", label: "Digital Art" },
  { id: "oil-painting", label: "Oil Painting" },
  { id: "watercolor", label: "Watercolor" },
  { id: "anime", label: "Anime" },
  { id: "3d-render", label: "3D Render" },
  { id: "sketch", label: "Sketch" },
  { id: "cinematic", label: "Cinematic" },
];

function generateTextPrompt(platform: Platform, topic: string, tone: Tone, format: Format, length: Length, context: string): string {
  const lengthInstr = length === "short" ? "Keep the response concise and under 200 words." : length === "medium" ? "Aim for a medium-length response of 300–500 words." : "Provide a thorough, detailed response with examples and explanations.";
  const toneMap: Record<Tone, string> = {
    professional: "Use a professional and authoritative tone.",
    casual: "Use a friendly, conversational tone as if talking to a friend.",
    creative: "Be imaginative and use vivid, engaging language.",
    academic: "Use formal academic language with citations where appropriate.",
    persuasive: "Be compelling and persuasive, using strong arguments.",
    humorous: "Add wit and humor to make the content entertaining.",
  };
  const formatMap: Record<Format, string> = {
    paragraph: "Write in well-structured paragraphs.",
    "bullet-points": "Use clear bullet points for easy scanning.",
    "step-by-step": "Present information as numbered steps.",
    table: "Format the response as a table where applicable.",
    email: "Format as a professional email with subject, greeting, body, and sign-off.",
    "blog-post": "Structure as a blog post with an introduction, headings, and conclusion.",
  };

  let prompt = `You are an expert on the topic of "${topic}". `;
  if (context.trim()) prompt += `Additional context: ${context.trim()}. `;
  prompt += `\n\n${toneMap[tone]} ${formatMap[format]} ${lengthInstr}`;
  if (platform === "chatgpt") prompt += `\n\nPlease provide a comprehensive response about: ${topic}`;
  if (platform === "claude") prompt += `\n\nI'd like you to thoughtfully address: ${topic}`;
  if (platform === "gemini") prompt += `\n\nExplain and elaborate on: ${topic}`;
  return prompt.trim();
}

function generateImagePrompt(platform: Platform, subject: string, style: ImageStyle, context: string): string {
  const styleDetails: Record<ImageStyle, string> = {
    photorealistic: "hyperrealistic, photorealistic, 8K UHD, sharp focus, professional photography",
    "digital-art": "digital art, vibrant colors, concept art, trending on ArtStation",
    "oil-painting": "oil painting, brushstrokes, textured canvas, classical art style",
    watercolor: "watercolor painting, soft washes, delicate brushwork, flowing colors",
    anime: "anime style, cel shading, vibrant, Studio Ghibli inspired",
    "3d-render": "3D render, octane render, volumetric lighting, cinema 4d, blender",
    sketch: "pencil sketch, hand-drawn, detailed linework, hatching",
    cinematic: "cinematic shot, dramatic lighting, film grain, anamorphic lens, movie still",
  };

  const qualityTags = platform === "midjourney"
    ? " --ar 16:9 --q 2 --v 6"
    : platform === "stable-diffusion"
    ? ", masterpiece, best quality, highly detailed"
    : "";

  let prompt = `${subject}`;
  if (context.trim()) prompt += `, ${context.trim()}`;
  prompt += `, ${styleDetails[style]}`;
  if (platform === "stable-diffusion") {
    prompt += `\n\nNegative prompt: blurry, low quality, distorted, ugly, bad anatomy, watermark, signature`;
  }
  prompt += qualityTags;
  return prompt.trim();
}

export default function AIPromptGenerator() {
  const [platform, setPlatform] = useState<Platform>("chatgpt");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [format, setFormat] = useState<Format>("paragraph");
  const [length, setLength] = useState<Length>("medium");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("photorealistic");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const isImage = isImagePlatform(platform);

  function generate() {
    if (!topic.trim()) return;
    const prompt = isImage
      ? generateImagePrompt(platform, topic, imageStyle, context)
      : generateTextPrompt(platform, topic, tone, format, length, context);
    setResult(prompt);
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selectCls = "w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      {/* Platform */}
      <div>
        <p className={labelCls}>Select AI Platform</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                platform === p.id
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-300"
              }`}
            >
              <span>{p.emoji}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className={labelCls}>{isImage ? "Subject / Scene Description" : "Topic or Task"}</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={isImage ? "e.g. A samurai warrior standing in a misty forest" : "e.g. How to improve focus and productivity"}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Text AI options */}
      {!isImage && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value as Tone)} className={selectCls}>
              {tones.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Output Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as Format)} className={selectCls}>
              {formats.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Length</label>
            <select value={length} onChange={(e) => setLength(e.target.value as Length)} className={selectCls}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>
      )}

      {/* Image style */}
      {isImage && (
        <div>
          <p className={labelCls}>Art Style</p>
          <div className="flex flex-wrap gap-2">
            {imageStyles.map((s) => (
              <button
                key={s.id}
                onClick={() => setImageStyle(s.id)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  imageStyle === s.id
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Extra context */}
      <div>
        <label className={labelCls}>Additional Context <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          rows={2}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={isImage ? "e.g. golden hour lighting, cherry blossom trees nearby" : "e.g. target audience is beginners, avoid jargon"}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
        />
      </div>

      <button
        onClick={generate}
        disabled={!topic.trim()}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
      >
        <Wand2 className="w-4 h-4" /> Generate Prompt
      </button>

      {result && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">Generated Prompt</p>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
        </div>
      )}
    </div>
  );
}
