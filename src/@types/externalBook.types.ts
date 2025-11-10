export type ExternalBookData = {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  edition?: string;
  description?: string;
  year?: number;
  pages?: number;
  img?: string;
  categories?: string[];
};

export type ExternalBookSearchResult = {
  title: string;
  author: string;
  isbn?: string;
  img?: string;
  raw: ExternalBookData;
};

export type EditionResult = {
  key: string;
  title: string;
  publish_date?: string;
  publishers?: string[];
  cover_i?: number;
};
