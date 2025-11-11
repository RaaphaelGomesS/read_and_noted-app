import { EditionResult, ExternalBookData, ExternalBookSearchResult } from "@/@types/externalBook.types";
import * as HandlerError from "@/service/HandlerApiException";
import axios from "axios";

const OPENLIBRARY_API_URL = "https://openlibrary.org";
const openLibraryApi = axios.create({
  baseURL: OPENLIBRARY_API_URL,
});

const mapRichEditionDataToExternalBookData = (editionData: any, isbn?: string): ExternalBookData => {
  let author: string = "Autor desconhecido";
  if (editionData.authors && Array.isArray(editionData.authors)) {
    const authorNames = editionData.authors.map((a: any) => (a.name ? a.name : null)).filter(Boolean);
    if (authorNames.length > 0) {
      author = authorNames.join(", ");
    }
  }

  const foundIsbn = isbn || editionData.identifiers?.isbn_13?.[0] || editionData.identifiers?.isbn_10?.[0] || "";

  const img = editionData.cover
    ? editionData.cover.medium
    : editionData.covers
    ? `https://covers.openlibrary.org/b/id/${editionData.covers[0]}-M.jpg`
    : foundIsbn
    ? `https://covers.openlibrary.org/b/isbn/${foundIsbn}-M.jpg`
    : undefined;

  let year: number | undefined = undefined;
  const dateString = editionData.publish_date || "";
  if (dateString) {
    const yearMatch = dateString.toString().match(/\b\d{4}\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[0], 10);
    }
  }

  const publisher = editionData.publishers?.map((p: any) => p.name).join(", ") || undefined;

  const subjectsArray = editionData.subjects || [];
  const categories = subjectsArray
    .map((subject: any) => subject.name)
    .filter(Boolean)
    .slice(0, 5);

  const descriptionObj = editionData.description;
  let description: string | undefined = undefined;
  if (typeof descriptionObj === "string") {
    description = descriptionObj;
  } else if (typeof descriptionObj === "object" && descriptionObj !== null && descriptionObj.value) {
    description = descriptionObj.value;
  }

  const editionName = undefined;

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
    edition: editionName,
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
    editionCount: doc.edition_count || 0,
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
      const mapToSearchResult = (book: any, isbn: string): ExternalBookSearchResult => {
        const rawData = mapRichEditionDataToExternalBookData(book, isbn);
        return {
          title: rawData.title,
          author: rawData.author,
          isbn: rawData.isbn,
          img: rawData.img,
          raw: rawData,
        };
      };
      return [mapToSearchResult(bookData, isbn)];
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
        language: "por",
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
    const editionResponse = await openLibraryApi.get(`${editionKey}.json`);

    const isbn = editionResponse.data?.isbn_13?.[0] || editionResponse.data?.isbn_10?.[0];

    if (!isbn) {
      throw new Error("Esta edição não possui um ISBN registrado para buscar detalhes.");
    }

    const response = await openLibraryApi.get("/api/books", {
      params: { bibkeys: `ISBN:${isbn}`, format: "json", jscmd: "data" },
    });

    const bookData = response.data[`ISBN:${isbn}`];
    if (bookData) {
      return mapRichEditionDataToExternalBookData(bookData, isbn);
    } else {
      throw new Error("Não foi possível encontrar detalhes ricos para o ISBN desta edição.");
    }
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar os detalhes da edição.");
  }
};
