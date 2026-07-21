# Divyesh Kamalanaban — Portfolio

**Live:** [divyesh.is-a.dev](https://divyesh.is-a.dev/)

Personal portfolio site for myself — final-year ECE student at SRM Institute of Science and Technology, showcasing work across ML/AI systems, and full-stack engineering. Built as a fast, single-page React app and deployed on GitHub Pages under a custom domain.

![Release](https://img.shields.io/github/v/release/Divyesh-Kamalanaban/divyesh-kamalanaban.github.io?label=version)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stars](https://img.shields.io/github/stars/Divyesh-Kamalanaban/divyesh-kamalanaban.github.io)

---

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | React 19 + React Router 7 |
| Language | TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Linting | `tsc --noEmit` |
| Hosting | GitHub Pages (custom domain via `CNAME`) |
| CI/CD | GitHub Actions (`.github/workflows`) |

The project is a lightweight client-side SPA — no server-side rendering, no backend — optimized for fast load and easy iteration on content.

## Project Structure

```
.
├── .github/workflows/   # GitHub Actions CI/CD for build & deploy
├── public/assets/        # Static assets (images, icons, resume, etc.)
├── src/                  # Application source (components, pages, routes)
├── index.html            # App entry point
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript configuration
├── CNAME                 # Custom domain mapping (divyesh.is-a.dev)
└── package.json
```

## Features

- **Single-page portfolio** covering background, technical skill set, and project highlights
- **Project showcase** spanning ML/AI research (fault detection, LLM quantization), agentic systems (SOC triage, multi-agent orchestration), embedded security (post-quantum cryptography on ESP32), and full-stack web platforms
- **Responsive, component-driven UI** built with Tailwind's utility classes and React Router for client-side navigation
- **Custom domain deployment** via GitHub Pages + `is-a.dev`, automated through GitHub Actions on every push to `main`

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that builds the Vite app and publishes it to GitHub Pages. The `CNAME` file maps the deployment to the custom domain `divyesh.is-a.dev`.

## Contact

- Portfolio: [divyesh.is-a.dev](https://divyesh.is-a.dev/)
- GitHub: [@Divyesh-Kamalanaban](https://github.com/Divyesh-Kamalanaban)
- LinkedIn: [linkedin.com/in/divyesh-kamalanaban](https://linkedin.com/in/divyesh-kamalanaban)
- Email: divyeshtalkswork@gmail.com

## License

MIT — feel free to reference the structure for your own portfolio, but please don't copy the content directly.
