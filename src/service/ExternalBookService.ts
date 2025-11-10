import { EditionResult, ExternalBookData, ExternalBookSearchResult } from "@/@types/externalBook.types";
import * as HandlerError from "@/service/HandlerApiException";
import axios from "axios";

const OPENLIBRARY_API_URL = "https://openlibrary.org";
const openLibraryApi = axios.create({
  baseURL: OPENLIBRARY_API_URL,
});

const mapEditionDataToExternalBookData = (editionData: any, isbn?: string): ExternalBookData => {
  const author = editionData.authors?.map((a: any) => a.name).join(", ") || "Autor desconhecido";

  const foundIsbn = isbn || editionData.isbn_13?.[0] || editionData.isbn_10?.[0] || "";

  const img = editionData.covers
    ? `https://covers.openlibrary.org/b/id/${editionData.covers[0]}-M.jpg`
    : foundIsbn
    ? `https://covers.openlibrary.org/b/isbn/${foundIsbn}-M.jpg`
    : undefined;

  let year: number | undefined = undefined;
  const dateString = editionData.publish_date || editionData.first_publish_year || "";
  if (dateString) {
    const yearMatch = dateString.toString().match(/\b\d{4}\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[0], 10);
    }
  }

  const publisher =
    editionData.publishers?.map((p: any) => (typeof p === "string" ? p : p.name)).join(", ") || undefined;

  const subjectsArray = editionData.subjects || editionData.subject_places || [];
  const categories = subjectsArray
    .map((subject: any) => {
      if (typeof subject === "string") return subject;
      if (typeof subject === "object" && subject.name) return subject.name;
      return null;
    })
    .filter((s: string | null): s is string => s !== null)
    .slice(0, 3);

  const descriptionObj = editionData.description;
  let description: string | undefined = undefined;
  if (typeof descriptionObj === "string") {
    description = descriptionObj;
  } else if (typeof descriptionObj === "object" && descriptionObj !== null && descriptionObj.value) {
    description = descriptionObj.value;
  }

  const rawData: ExternalBookData = {
    title: editionData.title,
    author: author,
    isbn: foundIsbn,
    pages: editionData.number_of_pages,
    year: year,
    publisher: publisher,
    img: img,
    categories: categories,
    description: description,
    edition: editionData.edition_name,
  };

  return rawData;
};

const mapOpenLibraryQueryToSearchResult = (doc: any): ExternalBookSearchResult => {
  const author = doc.author_name ? doc.author_name.join(", ") : "Autor desconhecido";
  const img = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined;

  const rawData: any = {
    title: doc.title,
    author: author,
    img: img,
    workKey: doc.key,
  };

  return {
    title: doc.title,
    author: author,
    img: img,
    raw: rawData,
  };
};

const mapOpenLibraryISBNToSearchResult = (book: any, isbn: string): ExternalBookSearchResult => {
  const rawData = mapEditionDataToExternalBookData(book, isbn);

  return {
    title: rawData.title,
    author: rawData.author,
    isbn: rawData.isbn,
    img: rawData.img,
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
      language: ["por"],
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
      params: { bibkeys: `ISBN:${isbn}`, format: "json", jscmd: "data" },
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

export const getEditionsForWork = async (workKey: string): Promise<EditionResult[]> => {
  try {
    const response = await openLibraryApi.get(`${workKey}/editions.json`, {
      params: {
        limit: 20,
        language: "por,eng",
      },
    });

    if (!response.data.entries || response.data.entries.length === 0) {
      throw new Error("Nenhuma edição encontrada para esta obra.");
    }

    return response.data.entries.map((entry: any) => ({
      key: entry.key,
      title: entry.title,
      publish_date: entry.publish_date,
      publishers: entry.publishers,
      cover_i: entry.covers ? entry.covers[0] : null,
    }));
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar as edições.");
  }
};

export const getBookDetailsFromEditionKey = async (editionKey: string): Promise<ExternalBookData> => {
  try {
    const response = await openLibraryApi.get(`${editionKey}.json`);
    return mapEditionDataToExternalBookData(response.data);
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar os detalhes da edição.");
  }
};
