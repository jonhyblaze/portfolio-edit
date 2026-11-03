const profile = {
  name: "Oleksandr Korotun",
  role: "Film & Video Editor",
  location: "Kyiv, Ukraine",
  /** Production origin. Metadata, the sitemap and link previews resolve against it. */
  url: "https://filmcuts.vercel.app",
  email: "oleksandr-korotun@proton.me",
  gmail: "",
  github: "https://github.com/jonhyblaze",
  instagram: "https://www.instagram.com/jonhyblaze/",
  telegram: "https://t.me/jonhyblaze",
  imdb: "https://www.imdb.com/name/nm9632341/",
  linkedIn: "https://www.linkedin.com/in/oleksandr-korotun-7275423b5/",
  /**
   * The CV linked from /about and the command palette. Hidden while the only one
   * on file is the front-end developer CV; set it back to a path under /public
   * (e.g. "/cv-oleksandr-korotun.pdf") and both links reappear.
   */
  cv: null as string | null,
  stack: ["Davinci Resolve Studio", "Final Cut Pro", "Figma", "Adobe Photoshop"],
}

export default profile
