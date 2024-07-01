export const showcaseVideo = "_dtyYDwHAIc";

export const videoIds = [
  showcaseVideo,
  "GPYAC1qGD44",
  "MaebEqhZR84",
  "Kpw1R7c1CfQ",
  "vioWIFInVVk",
  "Ngxf64vYuUQ",
  "J3W3s5O9wAs",
  "Kpw1R7c1CfQ",
  "nG3h5UolI9g",
];

export function getImgSrc(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getEmbedSrc(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
}
