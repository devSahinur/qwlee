const Blog = require("../src/models").Blog;
const images = require("./utils/images");
const { slugify } = require("./utils/slug");

const POSTS = [
  {
    title: "How to price your first freelance project without underselling",
    author: "Aria Sterling",
    description:
      "A practical framework for setting your starting rate as a new freelancer — without scaring buyers off or leaving money on the table.",
    content: `# How to price your first freelance project without underselling

Most new freelancers undercharge because they're benchmarking against the wrong people: other new freelancers. Anchor on the cost to the *buyer* of a bad outcome, not on what you'd accept on a quiet Tuesday.

## Start with the buyer's alternative

If a logo redesign delays a product launch by two weeks, the cost isn't your hourly rate. It's the missed launch. Price against that.

## Three packages, always

Buyers anchor on the middle option. Make your middle option the one you actually want to sell. The Basic is there to make the Standard look reasonable; the Premium is there to make the Standard feel safe.

## Don't negotiate against yourself

If your first quote feels uncomfortable to send, you're probably close to the right number. Send it.`,
  },
  {
    title: "AI tools that actually make freelancers faster (and the ones that don't)",
    author: "Marcus Chen",
    description:
      "Six AI tools we see consistently moving the needle for freelancers on Qwlee — and three that look impressive in demos but slow you down in practice.",
    content: `# AI tools that actually make freelancers faster

We surveyed 200 sellers on Qwlee last quarter about which AI tools they'd pay for again. Here's what came back.

## What moves the needle

- **Claude (Sonnet 4.6)** for first drafts of long-form writing and code reviews.
- **Cursor / Claude Code** for full-codebase refactors.
- **Descript** for podcast and video editing — overdub alone justifies it.
- **Linear's AI** for triaging client tickets.

## What looks great in demos but slows you down

- All-in-one "AI freelancer assistants" — too generic to be useful.
- AI proposal generators — buyers can spot them in two sentences.
- AI logo generators — fine for a moodboard, useless as a deliverable.`,
  },
  {
    title: "Five red flags in a freelance buyer brief",
    author: "Sofia Martinez",
    description:
      "How to recognise a client engagement that's going to end badly — before you accept the order.",
    content: `# Five red flags in a freelance buyer brief

After 8 years, I can spot a doomed engagement in 30 seconds. Here are the signals.

1. **No clear deadline.** Means scope creep. Push for a fixed date before you quote.
2. **"It should be simple"** in the brief. Means the buyer hasn't thought it through.
3. **No access to current assets.** Means you'll be redrawing everything from scratch.
4. **A budget number with no scope.** They've decided what it should cost; you haven't decided what it is yet.
5. **Pressure to start before contract.** Walk away.`,
  },
  {
    title: "Why remote-first companies are hiring more freelancers in 2026",
    author: "James O'Connor",
    description:
      "The shift toward team-of-teams structures means freelancers are getting more durable, higher-spec work — if they position correctly.",
    content: `# Why remote-first companies are hiring more freelancers in 2026

The "year of efficiency" wave reshaped how teams hire. Three patterns we're watching.

## 1. Fractional senior, not junior contractor

Companies that froze hiring still need senior judgment. Fractional CTOs, fractional design leads, and senior engineering contractors are the growth segment.

## 2. Project-shaped work, not staff-shaped

Buyers want defined deliverables with clear acceptance criteria — not hourly augmentation.

## 3. Buyers expect a portfolio that resembles their problem

Generic portfolios get filtered out. Niche ones close.`,
  },
  {
    title: "The freelance positioning mistake that costs you 80% of inbound",
    author: "Lena Fischer",
    description:
      "Most freelance profiles fail in the first sentence. Here's the fix.",
    content: `# The freelance positioning mistake that costs you 80% of inbound

Your title is doing 80% of the work on whether a buyer clicks. Most titles fail in the same way:

- **"Experienced developer"** — every developer claims to be experienced.
- **"Creative designer"** — no buyer is searching for "creative."
- **"Full-stack engineer"** — too generic to differentiate.

## A title that converts has three parts

1. **The deliverable** ("I will build a Next.js SaaS")
2. **The qualifier** ("with auth and Stripe")
3. **The proof** (in the description — case study, repo, named clients)

Everything else is decoration.`,
  },
];

async function seedBlogs() {
  const docs = POSTS.map((p, i) => ({
    title: p.title,
    slug: slugify(p.title),
    author: p.author,
    description: p.description,
    content: p.content,
    image: images.blog(p.title),
  }));
  const blogs = await Blog.insertMany(docs);
  return { blogs };
}

module.exports = { seedBlogs };
