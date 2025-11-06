export type Library = {
  id: number;
  name: string;
  description?: string;
};

export type LibraryRequestDTO = {
  id?: number;
  name: string;
  description: string;
};

export type LibraryResponsePageDTO = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  libraries: Library[];
};
