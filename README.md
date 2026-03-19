# The Hot Flushes Vocal Quartet Website

A modern, responsive website built for Melbourne's premier vocal quartet. Featuring a custom Markdown-based CMS for easy content management.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4, Shadcn UI
- **Animations**: Framer Motion
- **CMS**: File-system based Markdown (.md)

## Content Management (Administration)
The site features a built-in **Admin Editor** accessible at:
- **URL**: [/admin](http://localhost:3000/admin) (in local development)

### How to Edit Pages via the UI
1. Navigate to `/admin` in your browser.
2. Select the page you wish to modify.
3. Edit the Markdown content in the browser-based editor.
4. Click **Save Changes**. The site will be updated immediately.

### Image Management
- Upload new images to `public/images/`.
- Reference them in your Markdown files using the path `/images/your-image.jpg`.

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Deployment
The site is ready for deployment to platforms like Vercel or Netlify. Since it is mostly static, it will be extremely fast and reliable.
