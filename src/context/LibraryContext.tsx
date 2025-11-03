import * as Storage from "@/service/Storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface LibraryContextData {
  selectedLibraryId: number | null;
  selectLibrary: (id: number | null) => Promise<void>;
  isLoading: boolean;
}

const LibraryContext = createContext<LibraryContextData>({} as LibraryContextData);

const STORAGE_KEY = "libraryId";

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLibraryId, setSelectedLibraryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function loadLibraryId() {
      try {
        const storedId = await Storage.getItem(STORAGE_KEY);
        if (storedId) {
          setSelectedLibraryId(parseInt(storedId, 10));
        }
      } catch (e) {
        console.error("Falha ao carregar ID da biblioteca", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadLibraryId();
  }, []);

  useEffect(() => {
    if (!token) {
      selectLibrary(null);
    }
  }, [token]);


  const selectLibrary = async (id: number | null) => {
    setIsLoading(true);
    try {
      if (id === null) {
        setSelectedLibraryId(null);
        await Storage.removeItem(STORAGE_KEY);
      } else {
        setSelectedLibraryId(id);
        await Storage.setItem(STORAGE_KEY, id.toString());
      }
    } catch (e) {
      console.error("Falha ao salvar ID da biblioteca", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LibraryContext.Provider value={{ selectedLibraryId, selectLibrary, isLoading }}>
      {children}
    </LibraryContext.Provider>
  );
};

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}