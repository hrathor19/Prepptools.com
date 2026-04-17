import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy – PreppTools",
  description: "Learn how PreppTools collects, uses, and protects your information. We are committed to your privacy.",
};

const LAST_UPDATED = "April 18, 2026";

const SITE_NAME = "PreppTools";
const SITE_URL = "https://prepptools.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 pt-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Legal</p>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: <span className="font-medium text-gray-700 dark:text-gray-200">{LAST_UPDATED}</span>
        </p>
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
          <strong>Short version:</strong> {SITE_NAME} is a free tool website. We do not require you to create an account and we do not sell your personal data to anyone.
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">

        <Section title="1. Who We Are">
          <p>
            {SITE_NAME} operates the website{" "}
            <a href={SITE_URL} className="text-blue-600 dark:text-blue-400 hover:underline">{SITE_URL}</a>{" "}
            and provides free online tools for everyday tasks — including text tools, calculators, converters, PDF tools, and more.
          </p>
          <p>
            If you have any questions about this policy, feel free to reach out to us via the contact form on our website.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong className="text-gray-700 dark:text-gray-200">Information you give us voluntarily:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>When you submit a question on our Q&amp;A page: your name, optional email, and your question.</li>
            <li>When you suggest a tool on our About page: your name, optional email, optional phone number, and your suggestion.</li>
          </ul>
          <p>We use this only to respond to your message. We do not use it for marketing.</p>

          <p className="pt-1"><strong className="text-gray-700 dark:text-gray-200">Information collected automatically:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Usage data:</strong> Pages you visit, time spent, and general navigation — used to improve the website.</li>
            <li><strong>Device data:</strong> Browser type, operating system, and approximate location (country/city level).</li>
            <li><strong>Anonymised session data:</strong> How users interact with our tools, used purely to identify usability issues. This does not identify you personally.</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>To operate and improve our tools and website.</li>
            <li>To respond to questions and suggestions you send us.</li>
            <li>To monitor for abuse and security issues.</li>
            <li>To comply with applicable laws.</li>
          </ul>
          <p>We do <strong>not</strong> use your data for automated decision-making or profiling.</p>
        </Section>

        <Section title="4. Cookies">
          <p>
            We use cookies — small text files stored in your browser — to make the website work and to understand how it is used. This includes:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Essential cookies:</strong> For basic functionality like remembering your theme preference.</li>
            <li><strong>Analytics cookies:</strong> To track page views and usage patterns in an anonymised way.</li>
            <li><strong>Advertising cookies:</strong> To display relevant ads. These may use general browsing context to show useful ads.</li>
          </ul>
          <p>
            You can disable cookies at any time in your browser settings. Disabling some cookies may affect how the website works.
          </p>
        </Section>

        <Section title="5. Data Storage and Security">
          <p>
            Information you submit (Q&amp;A questions, tool suggestions) is stored securely and encrypted both in transit and at rest.
          </p>
          <p>
            Most tools on {SITE_NAME} run <strong>entirely in your browser</strong>. Text you enter into tools like the Word Counter, PDF tools, or calculators is processed locally and never sent to our servers.
          </p>
          <p>
            We take reasonable steps to protect your data from unauthorised access or misuse. However, no system is 100% secure.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Q&amp;A questions and tool suggestions are kept until you request deletion.</li>
            <li>Analytics data is retained for up to 26 months.</li>
            <li>Server logs are retained for a short period for security purposes.</li>
          </ul>
        </Section>

        <Section title="7. Sharing of Information">
          <p>We do <strong>not sell, rent, or share</strong> your personal information with third parties for their marketing purposes.</p>
          <p>We may share information only when:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Required by law or a valid legal process.</li>
            <li>Necessary to protect the safety of our users or the public.</li>
            <li>Shared with trusted service providers who help us run the website, under strict confidentiality agreements.</li>
          </ul>
        </Section>

        <Section title="8. Advertising">
          <p>
            {SITE_NAME} shows ads to keep all tools free for everyone. Ads are provided by a third-party advertising network. These ads may use anonymised information about your general browsing context to show relevant content.
          </p>
          <p>
            We do not control which specific ads are shown. Advertising revenue allows us to maintain and grow the platform without charging users.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            {SITE_NAME} is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has submitted personal data to us, please contact us and we will delete it promptly.
          </p>
        </Section>

        <Section title="10. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Access</strong> the personal data we hold about you.</li>
            <li><strong>Correct</strong> any inaccurate information.</li>
            <li><strong>Request deletion</strong> of your data at any time.</li>
            <li><strong>Object</strong> to how we process your data.</li>
          </ul>
          <p>
            To exercise any of these rights, reach out to us via the contact form on our website. We will respond within 30 days.
          </p>
        </Section>

        <Section title="11. Links to Other Websites">
          <p>
            Our website may contain links to other websites (for example in blog posts). We are not responsible for the privacy practices of those sites and encourage you to read their own privacy policies.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy occasionally. When we do, the "Last updated" date at the top of this page will change. Continued use of {SITE_NAME} after any changes means you accept the updated policy.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>For any questions or requests about this Privacy Policy, reach us at:</p>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mt-1">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{SITE_NAME}</p>
            <p>Website: <a href={SITE_URL} className="text-blue-600 dark:text-blue-400 hover:underline">{SITE_URL}</a></p>
            <p className="text-gray-500 dark:text-gray-400">Use the contact form on our website to get in touch.</p>
          </div>
        </Section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-700">
        <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
