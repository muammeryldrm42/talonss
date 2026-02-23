export interface NewsSource {
  title: string;
  region: string;
  domain: string;
}

export interface NewsCurrency {
  code: string;
  title: string;
  slug: string;
  url: string;
}

export interface NewsPost {
  id: number;
  kind: 'news' | 'media';
  title: string;
  published_at: string;
  slug: string;
  currencies: NewsCurrency[];
  url: string;
  source: NewsSource;
  votes: {
    negative: number;
    positive: number;
    important: number;
    liked: number;
    disliked: number;
    lol: number;
    toxic: number;
    saved: number;
    comments: number;
  };
}
