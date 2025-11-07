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
