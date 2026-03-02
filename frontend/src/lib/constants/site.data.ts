// src/lib/constants/site.data.ts
// ─────────────────────────────────────────────────────────
// Static data for Footer, OurTeam, and AboutUs sections.
// Replace with API/CMS data when ready.
// ─────────────────────────────────────────────────────────

// ── About Us / Vision ─────────────────────────────────────
export const ABOUT = {
  tagline:  "Empowering the next generation of talent.",
  mission:  "We built CareerUnlock because finding the right opportunity shouldn't feel like a full-time job. We connect students and early-career professionals with internships, jobs, hackathons, and events — all in one place, verified and curated.",
  vision:   "A world where every student, regardless of college or city, has equal access to career-defining opportunities.",
  stats: [
    { value: "2.8Mn+", label: "Students Registered"  },
    { value: "500+",   label: "Partner Companies"     },
    { value: "12,000+",label: "Opportunities Listed"  },
    { value: "98%",    label: "Verified Listings"      },
  ],
  values: [
    {
      emoji: "🎯",
      title: "Equal Access",
      desc:  "Every student deserves the same shot at a great career, regardless of their institution.",
    },
    {
      emoji: "✅",
      title: "Trust First",
      desc:  "Every listing is verified. We don't publish what we can't stand behind.",
    },
    {
      emoji: "⚡",
      title: "Move Fast",
      desc:  "Opportunities expire. We make sure you hear about them first.",
    },
  ],
};

// ── Team ─────────────────────────────────────────────────
export const TEAM = [
  {
    name:     "Aarav Mehta",
    role:     "Co-founder & CEO",
    bio:      "Former SDE at Google. Passionate about democratising access to career opportunities.",
    initials: "AM",
    color:    "from-blue-500 to-indigo-600",
    linkedin: "https://linkedin.com",
    twitter:  "https://twitter.com",
  },
  {
    name:     "Priya Sharma",
    role:     "Co-founder & CPO",
    bio:      "Ex-product lead at Razorpay. Obsessed with building products students actually love.",
    initials: "PS",
    color:    "from-violet-500 to-purple-600",
    linkedin: "https://linkedin.com",
    twitter:  "https://twitter.com",
  },
  {
    name:     "Rohan Gupta",
    role:     "Head of Engineering",
    bio:      "Full-stack engineer with 8 years building scalable platforms at startups and MNCs.",
    initials: "RG",
    color:    "from-orange-400 to-rose-500",
    linkedin: "https://linkedin.com",
    twitter:  "https://twitter.com",
  },
  {
    name:     "Sneha Iyer",
    role:     "Head of Partnerships",
    bio:      "Built relationships with 300+ companies. Believes every student deserves a mentor.",
    initials: "SI",
    color:    "from-emerald-500 to-teal-600",
    linkedin: "https://linkedin.com",
    twitter:  "https://twitter.com",
  },
  {
    name:     "Karan Batra",
    role:     "Lead Designer",
    bio:      "Crafting interfaces that are intuitive, delightful, and accessible to all.",
    initials: "KB",
    color:    "from-cyan-500 to-blue-600",
    linkedin: "https://linkedin.com",
    twitter:  "https://twitter.com",
  },
  {
    name:     "Ananya Nair",
    role:     "Community Manager",
    bio:      "Grew our student community from 0 to 500K. Every student has a story worth telling.",
    initials: "AN",
    color:    "from-pink-500 to-rose-600",
    linkedin: "https://linkedin.com",
    twitter:  "https://twitter.com",
  },
];

// ── Footer ────────────────────────────────────────────────
export const FOOTER = {
  tagline: "Your career journey starts here.",
  links: [
    {
      heading: "Opportunities",
      items: [
        { label: "Internships", href: "/internships" },
        { label: "Jobs",        href: "/jobs"        },
        { label: "Hackathons",  href: "/hackathons"  },
        { label: "Events",      href: "/events"      },
        { label: "Courses",     href: "/courses"     },
      ],
    },
    {
      heading: "Company",
      items: [
        { label: "About Us",  href: "/about"   },
        { label: "Our Team",  href: "/team"    },
        { label: "Careers",   href: "/careers" },
        { label: "Blog",      href: "/blog"    },
        { label: "Press",     href: "/press"   },
      ],
    },
    {
      heading: "Support",
      items: [
        { label: "Help Center",    href: "/help"    },
        { label: "Contact Us",     href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Use",   href: "/terms"   },
      ],
    },
  ],
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com",  icon: "linkedin" },
    { label: "Twitter",  href: "https://twitter.com",   icon: "twitter"  },
    { label: "Instagram",href: "https://instagram.com", icon: "instagram"},
    { label: "GitHub",   href: "https://github.com",    icon: "github"   },
  ],
  copyright: `© ${new Date().getFullYear()} CareerUnlock. All rights reserved.`,
};