import { cn } from "@/lib/utils";

type LogoType = {
	src: string;
	alt: string;
	isInvertable?: boolean;
};

type TileData = {
	row: number;
	col: number;
	logo?: LogoType;
};

export function Integrations() {
	return (
		<div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 md:grid-cols-2 md:items-center mt-32 mb-16">
			{/* Left Content */}
			<div className="max-w-xl space-y-5">
				<h2 className="font-display font-semibold text-3xl text-[#0a1b33] tracking-tight sm:text-4xl md:text-5xl">
					Seamless Integration
				</h2>
				<p className="font-sans text-lg text-slate-500 leading-8">
					Vector connects with the tools you already use. Sync with your calendar, pull tasks from Notion, and streamline your entire academic workflow.
				</p>
			</div>

			{/* Right Content - Visual */}
			<div className="place-items-end flex justify-end">
				<div 
					className="relative h-[360px] w-[360px]"
					style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)' }}
				>
					{tiles.map((tile) => (
						<IntegrationCard key={`${tile.row}_${tile.col}`} {...tile} />
					))}
				</div>
			</div>
		</div>
	);
}

function IntegrationCard({ row, col, logo }: TileData) {
	return (
		<div
			className={cn(
				"absolute flex h-[64px] w-[64px] items-center justify-center rounded-2xl border transition-all duration-300",
				logo
					? "bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-slate-200/80 hover:shadow-md hover:scale-105 z-10"
					: "bg-white/40 border-slate-200/40 z-0" // Styling for empty tiles
			)}
			style={{
				left: col * 72 + 4, // 72px cell, centered
				top: row * 72 + 4,
			}}
		>
			{logo && (
				<img
					alt={logo.alt}
					className={cn(
						"pointer-events-none h-[28px] w-[28px] select-none object-contain",
						logo.isInvertable && "dark:invert"
					)}
					src={logo.src}
				/>
			)}
		</div>
	);
}

// Coordinate mapping to approximate the "scattered" look in the image.
// Grid 5x5.
const tiles: TileData[] = [
	// Row 0
	{
		row: 0,
		col: 1,
	},
	{
		row: 0,
		col: 3,
		logo: {
            // Notion
			src: "https://svgl.app/library/notion.svg",
			alt: "Notion",
            isInvertable: true,
		},
	},

	// Row 1
	{ row: 1, col: 0 }, // Empty
	{
		row: 1,
		col: 2,
		logo: {
            // Google Calendar
			src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
			alt: "Google Calendar",
		},
	},
	{
		row: 1,
		col: 4,
		logo: {
            // Vercel
			src: "https://svgl.app/library/vercel.svg",
			alt: "Vercel",
			isInvertable: true,
		},
	},

	// Row 2
	{
		row: 2,
		col: 1,
		logo: {
            // Slack
			src: "https://svgl.app/library/slack.svg",
			alt: "Slack",
		},
	},
	{
		row: 2,
		col: 3,
		logo: {
            // Gmail
			src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
			alt: "Gmail",
		},
	}, 

	// Row 3
	{ row: 3, col: 0 }, // Empty
	{
		row: 3,
		col: 2,
		logo: {
            // Supabase
			src: "https://svgl.app/library/supabase.svg",
			alt: "Supabase",
		},
	},
	{
		row: 3,
		col: 4,
		logo: {
            // Linear
			src: "https://svgl.app/library/linear.svg",
			alt: "Linear",
            isInvertable: true,
		},
	},

	// Row 4
	{
		row: 4,
		col: 1,
		logo: {
            // GitHub
			src: "https://svgl.app/library/github.svg",
			alt: "GitHub",
            isInvertable: true,
		},
	},
	{
		row: 4,
		col: 3,
		logo: {
            // Figma
			src: "https://svgl.app/library/figma.svg",
			alt: "Figma",
		},
	},
];

export default Integrations;
