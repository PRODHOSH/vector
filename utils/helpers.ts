export function getSiteUrl(): string {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
    siteUrl = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3001";
  }
  return siteUrl;
}
