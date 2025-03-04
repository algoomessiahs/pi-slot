
import type { Config } from "tailwindcss";
import plugin from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
        // Game specific colors - Updated with Pi Colors
        donut: {
          pink: '#FF70B5',
          red: '#FF4560',
          yellow: '#FFDB58',
          cream: '#FFF0DB',
          brown: '#7D5A50',
          purple: '#B76EF0',
          blue: '#70C1FF',
          gold: '#FDCC0D',
        },
        candy: {
          background: '#F5F5F7',  // Light background similar to Pi app
          accent: '#9b87f5',      // Pi primary purple
          border: '#7E69AB',      // Secondary purple
          button: {
            primary: '#9b87f5',   // Pi primary purple
            secondary: '#FFDB58', // Yellow accent
          }
        },
        pi: {
          background: '#F5F5F7',  // Light background similar to Pi app
          primary: '#9b87f5',     // Primary purple
          secondary: '#7E69AB',   // Secondary purple
          tertiary: '#6E59A5',    // Tertiary purple
          dark: '#1A1F2C',        // Dark color
          light: '#D6BCFA',       // Light purple
          neutral: '#8E9196',     // Neutral gray
        }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
        'slot-spin': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' }
        },
        'slot-stop': {
          '0%': { transform: 'translateY(-100%)' },
          '25%': { transform: 'translateY(-90%)' },
          '50%': { transform: 'translateY(-100%)' },
          '75%': { transform: 'translateY(-95%)' },
          '100%': { transform: 'translateY(-100%)' }
        },
        'float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        'jackpot-pulse': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'win-shine': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        'coins-rain': {
          '0%': { transform: 'translateY(-100%)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'slot-spin': 'slot-spin 0.5s linear infinite',
        'slot-stop': 'slot-stop 0.3s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'jackpot-pulse': 'jackpot-pulse 2s ease-in-out infinite',
        'win-shine': 'win-shine 2s linear infinite',
        'coins-rain': 'coins-rain 3s linear forwards',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
			},
      backgroundImage: {
        'pi-pattern': "url('/assets/images/pi-pattern.png')",
        'win-gradient': 'linear-gradient(90deg, #9b87f5, #FFDB58, #9b87f5)',
      },
		}
	},
	plugins: [plugin],
} satisfies Config;
