export const showcaseVideo = "MaebEqhZR84";

export const videoIds = [
  showcaseVideo,
  "ZCdvjNTcT1I",
  "GOihOAcIgMw",
  "oxAIcGqFiT8",
];

export function getImgSrc(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getEmbedSrc(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
}
