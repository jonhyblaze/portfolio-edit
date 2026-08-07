import type { Config } from "tailwindcss"

const config: Config = {
  future: {
      hoverOnlyWhenSupported: true,
    },
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)", "monospace"]
      },
      fontSize: {
        "md": "1rem",
        "8.5xl": "5rem",
        "4.5xl": "2.625rem",
        "3.5xl": "2rem"
      },
      height: {
        "74": "18.875rem"
      },
      screens: {
        "mobile-375": "375px",
        "mobile-400": "400px",
        "mobile-425": "425px",
        "mobile-500": "500px",
        "laptop": "1440px"
      },
      colors: {
        primitives: {
          "white": "var(--white)",
          "black": "var(--black)",
          "white-70": "var(--white-70)",
          "white-50": "var(--white-50)",
          "white-20": "var(--white-20)",
          "white-10": "var(--white-10)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "var(--border)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      listStyleType: {
        square: "square"
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0"
          },
          to: {
            height: "var(--radix-accordion-content-height)"
          }
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)"
          },
          to: {
            height: "0"
          }
        },
        "slide-to-right": {
          from: {
            transform: "translateX(0%)"
          },
          to: {
            transform: "translateX(30%)"
          }
        },
        letterFade: {
          "0%": { opacity: "0.1", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0.1" },
          "100%": { opacity: "1" }
        },
        // Film grain: shift the noise tile around so it never sits still.
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-4%, -4%)" },
          "20%": { transform: "translate(-8%, 3%)" },
          "30%": { transform: "translate(5%, -6%)" },
          "40%": { transform: "translate(-3%, 7%)" },
          "50%": { transform: "translate(-8%, 2%)" },
          "60%": { transform: "translate(6%, 0)" },
          "70%": { transform: "translate(0, 8%)" },
          "80%": { transform: "translate(3%, 5%)" },
          "90%": { transform: "translate(-4%, 3%)" }
        },
        // Scroll hint: a line drawn downward, over and over.
        "scroll-hint": {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "scaleY(1)", opacity: "0" }
        },
        // Projectionist's cue mark: two beats, then gone.
        "cue-flash": {
          "0%, 74%, 100%": { opacity: "0" },
          "76%, 82%": { opacity: "0.75" },
          "84%, 90%": { opacity: "0" },
          "92%, 96%": { opacity: "0.75" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-to-right": "slide-to-right 1s ease-out infinite",
        "letter-fade": "letterFade 6s ease forwards infinite",
        "fade-in-letter": "fade-in 3s linear forwards infinite",
        grain: "grain 0.7s steps(1) infinite",
        "cue-flash": "cue-flash 4s linear infinite",
        "scroll-hint": "scroll-hint 2.2s ease-in-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
export default config
