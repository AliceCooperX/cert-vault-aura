import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'academic-navy': 'hsl(var(--academic-navy))',
        'academic-gold': 'hsl(var(--academic-gold))',
        'academic-gold-light': 'hsl(var(--academic-gold-light))',
        'secure-emerald': 'hsl(var(--secure-emerald))',
        'secure-emerald-light': 'hsl(var(--secure-emerald-light))',
        'parchment': 'hsl(var(--parchment))',
        'parchment-dark': 'hsl(var(--parchment-dark))',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-academic': 'var(--gradient-academic)',
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-secure': 'var(--gradient-secure)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      boxShadow: {
        'academic': 'var(--shadow-academic)',
        'gold': 'var(--shadow-gold)',
        'secure': 'var(--shadow-secure)',
        'glow-gold': 'var(--glow-gold)',
        'glow-secure': 'var(--glow-secure)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "scroll-reveal": {
          from: { opacity: "0", transform: "translateY(30px) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "circuit-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--academic-gold) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--academic-gold) / 0.6), 0 0 40px hsl(var(--secure-emerald) / 0.3)" },
        },
        "book-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        "seal-pulse": {
          "0%, 100%": { 
            transform: "scale(1)", 
            filter: "drop-shadow(0 0 10px hsl(var(--secure-emerald) / 0.3))" 
          },
          "50%": { 
            transform: "scale(1.05)", 
            filter: "drop-shadow(0 0 20px hsl(var(--secure-emerald) / 0.6))" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scroll-reveal": "scroll-reveal 0.8s ease-out",
        "circuit-glow": "circuit-glow 3s ease-in-out infinite",
        "book-flip": "book-flip 2s ease-in-out infinite",
        "seal-pulse": "seal-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
