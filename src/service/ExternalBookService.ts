import { ExternalBookData, ExternalBookSearchResult } from "@/@types/externalBook.types";
import * as HandlerError from "@/service/HandlerApiException";
import axios from "axios";

const OPENLIBRARY_API_URL = "https://openlibrary.org";
const openLibraryApi = axios.create({
  baseURL: OPENLIBRARY_API_URL,
});

const mapOpenLibraryQueryToSearchResult = (doc: any): ExternalBookSearchResult => {
  const author = doc.author_name ? doc.author_name.join(", ") : "Autor desconhecido";
  const isbn = doc.isbn ? doc.isbn[0] : "";
  const year = doc.first_publish_year;
  const img = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined;

  const rawData: ExternalBookData = {
    title: doc.title,
    author: author,
    isbn: isbn,
    pages: doc.number_of_pages_median,
    year: year,
    publisher: doc.publisher ? doc.publisher.join(", ") : undefined,
    img: img,
    categories: doc.subject ? doc.subject.slice(0, 3) : [],
    description: doc.first_sentence_value,
  };

  return {
    title: doc.title,
    author: author,
    isbn: isbn,
    img: img,
    raw: rawData,
  };
};

const mapOpenLibraryISBNToSearchResult = (book: any, isbn: string): ExternalBookSearchResult => {
  const author = book.authors ? book.authors.map((a: any) => a.name).join(", ") : "Autor desconhecido";

  const img = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  const year = book.publish_date ? parseInt(book.publish_date.split("-")[0], 10) : undefined;
  const pages = book.number_of_pages;
  const publisher = book.publishers ? book.publishers.map((p: any) => p.name).join(", ") : undefined;

  const rawData: ExternalBookData = {
    title: book.title,
    author: author,
    isbn: isbn,
    pages: pages,
    year: year,
    publisher: publisher,
    img: img,
    categories: book.subjects ? book.subjects.map((s: any) => s.name).slice(0, 3) : [],
    description: book.description
      ? typeof book.description === "string"
        ? book.description
        : book.description.value
      : undefined,
    edition: book.edition_name,
  };

  return {
    title: book.title,
    author: author,
    isbn: isbn,
    img: img,
    raw: rawData,
  };
};

export const searchOpenLibraryByQuery = async (
  query: string,
  mode: "title" | "author"
): Promise<ExternalBookSearchResult[]> => {
  try {
    const params: any = {
      limit: 20,
    };

    if (mode === "title") {
      params.title = query;
    } else if (mode === "author") {
      params.author = query;
    } else {
      params.q = query;
    }

    const response = await openLibraryApi.get("/search.json", {
      params: params,
    });

    if (response.data && response.data.docs) {
      return response.data.docs.map(mapOpenLibraryQueryToSearchResult);
    }
    return [];
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar na OpenLibrary.");
  }
};

export const searchOpenLibraryByISBN = async (isbn: string): Promise<ExternalBookSearchResult[]> => {
  try {
    const response = await openLibraryApi.get("/api/books", {
      params: {
        bibkeys: `ISBN:${isbn}`,
        format: "json",
        jscmd: "data",
      },
    });

    const bookData = response.data[`ISBN:${isbn}`];

    if (bookData) {
      return [mapOpenLibraryISBNToSearchResult(bookData, isbn)];
    }
    return [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw HandlerError.handleApiError(error, "Não foi possível buscar ISBN na OpenLibrary.");
  }
};
