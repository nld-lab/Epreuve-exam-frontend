import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ApiSuccess,
  Paginated,
  Pole,
  Filiere,
  Annee,
  Epreuve,
  Admin,
} from "@/types";

export interface EpreuveFilters {
  page?: number;
  limit?: number;
  q?: string;
  poleId?: number;
  filiereId?: number;
  anneeId?: number;
  session?: string;
  anneeAcademique?: string;
}

// --- Ressources publiques ---

export function usePoles() {
  return useQuery({
    queryKey: ["poles"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Pole[]>>("/public/poles");
      return res.data.data;
    },
  });
}

export function useFilieres() {
  return useQuery({
    queryKey: ["filieres"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Filiere[]>>("/public/filieres");
      return res.data.data;
    },
  });
}

export function useAnnees() {
  return useQuery({
    queryKey: ["annees"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Annee[]>>("/public/annees");
      return res.data.data;
    },
  });
}

export function useEpreuves(filters: EpreuveFilters) {
  return useQuery({
    queryKey: ["epreuves", filters],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.get<Paginated<Epreuve>>("/public/epreuves", {
        params: filters,
      });
      return res.data;
    },
  });
}

export function useEpreuve(id: number | undefined) {
  return useQuery({
    queryKey: ["epreuve", id],
    enabled: id != null,
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Epreuve>>(`/public/epreuves/${id}`);
      return res.data.data;
    },
  });
}

// --- Ressources d'administration (auth requise) ---

export function useAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Admin[]>>("/admins");
      return res.data.data;
    },
  });
}
