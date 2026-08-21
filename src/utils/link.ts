export type LinkKind = 'video' | 'website';

export function getLinkKind(url: string): LinkKind {
  return /youtu\.be|youtube\.com|vimeo\.com/i.test(url) ? 'video' : 'website';
}

export function getVideoEmbedUrl(url: string): string | null {
  const youtubeShort = url.match(/youtu\.be\/([\w-]+)/);
  if (youtubeShort) return `https://www.youtube.com/embed/${youtubeShort[1]}`;

  const youtubeWatch = url.match(/[?&]v=([\w-]+)/);
  if (youtubeWatch) return `https://www.youtube.com/embed/${youtubeWatch[1]}`;

  if (/youtube\.com\/embed\//.test(url)) return url;

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}
