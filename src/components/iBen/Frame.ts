export const showcaseVideo = "MaebEqhZR84";

export const videoIds = [
  showcaseVideo,
  "Kpw1R7c1CfQ",
  "1WuC6sykqj0",
  "DQBbBFIfjQI",
  "NkzzHYp3gag",
  "vv3HaXTNqjQ",
];

export function getImgSrc(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getEmbedSrc(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
}
