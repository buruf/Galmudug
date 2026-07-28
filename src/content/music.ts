/**
 * Curated Galmudug music — real, verified YouTube videos from a playlist of
 * Galmudug-themed songs (patriotic anthems, celebration and "14 August"
 * statehood-day songs) by artists associated with the region.
 *
 * Only the video id, title, performer credit, and year are stored — we NEVER
 * reproduce lyrics. Videos are embedded/linked and remain the property of
 * their creators and performers.
 *
 * Order follows the source playlist. To add a song: verify it is embeddable
 *   https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json
 * then append an entry here. Titles/credits are cleaned from the upload titles;
 * correct any spelling or attribution as needed.
 */
export interface MusicVideo {
  /** YouTube video id. */
  id: string;
  /** Song title (cleaned). */
  title: string;
  /** Performer(s), or the publishing studio where no performer is credited. */
  artist: string;
  /** Release year, when known. */
  year?: number;
}

export const MUSIC_VIDEOS: MusicVideo[] = [
  { id: "FsgeHBnZsbg", title: "Sanad-guuradii Galmudug", artist: "Maxamed Jaamac" },
  { id: "A2ZBShrIYE8", title: "Galmudug", artist: "Nimco Yaasiin Caraale", year: 2024 },
  { id: "v8gYP6bHs0I", title: "Galmudug Waa Duni Kale", artist: "Najma Nashaad" },
  { id: "q_MghBEYAMM", title: "Reer Galmudug — 14 August", artist: "Himilo Films", year: 2025 },
  { id: "qxGWlNAbIQI", title: "In ka Badan Malyuun Jeer", artist: "Kooxda Waaberi Galmudug", year: 2025 },
  { id: "AHJdlUPcjjg", title: "Markastaba Galmudug Waa Miisaanka Culus", artist: "Himilo Films", year: 2025 },
  { id: "ypFHDbC5xkg", title: "Waa Reer Galmudug (14 August)", artist: "SomaliSwiss", year: 2024 },
  { id: "LZ2XfBTjdyU", title: "Looma Goodiyaan Waa Galmudug", artist: "SomaliSwiss", year: 2024 },
  { id: "j0VAPyShCUI", title: "Xafladii Galmudug (Live)", artist: "Sakariye Kobciye & Xamdi Bilan", year: 2023 },
  { id: "uhutjg4kVBk", title: "Dhumucda Dhaqaalaha", artist: "Kooxda Waaberi Galmudug", year: 2025 },
  { id: "K6Dpe1JtCuk", title: "Waa Habeen Galmudug", artist: "Kalsoon MK", year: 2025 },
  { id: "u7EcApU2-NU", title: "Calankii Galmudug", artist: "Yurub Dheeman", year: 2025 },
  { id: "O4rWvfihK3s", title: "Galmudug", artist: "Ismaciil Aarka" },
  { id: "ghxuJvq6CLc", title: "Heestii Galmudug", artist: "Dayax Dalnuurshe", year: 2023 },
  { id: "p2EO4VErGb4", title: "Wadnahii Gayigaay Galmudug", artist: "Nimcaan Hilaac ft. Xamdi Bilan", year: 2019 },
  { id: "VESLdem4cxs", title: "Galmudug", artist: "Ismaciil Aarka", year: 2023 },
  { id: "S7M09v8rhcU", title: "Galmudug (Dhiigaa i Kacay)", artist: "Sakariye Kobciye, Xamdi Bilan & Shaafici Qaran Doon", year: 2022 },
  { id: "tv3ZF0vmcJI", title: "Galmudug", artist: "Ismaciil Aarka", year: 2022 },
  { id: "nYPi0bM0m1E", title: "Hobeey Galmudug", artist: "Abdullahi Boqol", year: 2016 },
  { id: "m92tiQFSXEI", title: "Baro Waa Galmudug", artist: "Hobalada Waaberi", year: 2020 },
  { id: "_ZJOcZEqyLk", title: "Galmudug", artist: "Mohamed Biibshe & Maxamed Jamac", year: 2021 },
  { id: "IdYG-hx-PUA", title: "Madaxaa i Furan Galmudug", artist: "Sakariye Kobciye & Xamdi Bilan", year: 2021 },
  { id: "_z0St9QuMwI", title: "Galmudug", artist: "Qaali Ladan, Sacdiyo Siman & Mohamed Biibshe", year: 2020 },
  { id: "WB-pC3wjl5o", title: "Gaarbey u Leeyihiin (Galmudug)", artist: "Raadraaca Fanka" },
  { id: "6lp_te31--E", title: "Galmudug Waxey", artist: "Boqol, Hodan, Dalmar, Sahruuja & Alta", year: 2015 },
  { id: "pfVU-LENkgY", title: "Saldhigtaye Galmudug", artist: "Studio Liibaan", year: 2014 },
];
