const repoName = 'CCRT2_Portfolio';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGitHubPages ? { basePath: `/${repoName}` } : {}),
};

export default nextConfig;
