import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccess, Admin, Annee, Epreuve, Filiere, Pole } from "@/types";

// --- Poles ---

export interface PoleInput {
  nom: string;
  pays: string;
}

export function useCreatePole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PoleInput) => {
      const res = await api.post<ApiSuccess<Pole>>("/poles", input);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["poles"] }),
  });
}

export function useUpdatePole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: PoleInput & { id: number }) => {
      const res = await api.put<ApiSuccess<Pole>>(`/poles/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["poles"] }),
  });
}

export function useDeletePole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/poles/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["poles"] }),
  });
}

// --- Filieres ---

export interface FiliereInput {
  nom: string;
  description?: string;
}

export function useCreateFiliere() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: FiliereInput) => {
      const res = await api.post<ApiSuccess<Filiere>>("/filieres", input);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["filieres"] });
      qc.invalidateQueries({ queryKey: ["poles"] });
    },
  });
}

export function useUpdateFiliere() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      nom,
      description,
    }: {
      id: number;
      nom?: string;
      description?: string | null;
    }) => {
      const res = await api.put<ApiSuccess<Filiere>>(`/filieres/${id}`, {
        nom,
        description,
      });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["filieres"] }),
  });
}

export function useDeleteFiliere() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/filieres/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["filieres"] });
      qc.invalidateQueries({ queryKey: ["poles"] });
    },
  });
}

// --- Annees ---

export interface AnneeInput {
  libelle: string;
  ordre?: number;
}

export function useCreateAnnee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AnneeInput) => {
      const res = await api.post<ApiSuccess<Annee>>("/annees", input);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["annees"] }),
  });
}

export function useUpdateAnnee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: AnneeInput & { id: number }) => {
      const res = await api.put<ApiSuccess<Annee>>(`/annees/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["annees"] }),
  });
}

export function useDeleteAnnee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/annees/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["annees"] }),
  });
}

// --- Admins ---

export interface AdminInput {
  nom: string;
  email: string;
  password?: string;
  role: "SUPERADMIN" | "ADMIN";
  poleId?: number | null;
}

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminInput) => {
      const res = await api.post<ApiSuccess<Admin>>("/admins", input);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admins"] }),
  });
}

export function useUpdateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: AdminInput & { id: number }) => {
      const payload = { ...input };
      if (!payload.password) delete payload.password;
      const res = await api.put<ApiSuccess<Admin>>(`/admins/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admins"] }),
  });
}

export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admins/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admins"] }),
  });
}

// --- Epreuves (multipart/form-data avec PDF ou DOCX) ---

export interface EpreuveInput {
  titre: string;
  matiere: string;
  typeExamen?: string;
  session: "NORMALE" | "RATTRAPAGE";
  anneeAcademique: string;
  poleId: number;
  filiereId: number;
  anneeId: number;
  fichier?: File | null;
}

function toFormData(input: Partial<EpreuveInput>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") continue;
    if (key === "fichier" && value instanceof File) {
      fd.append("fichier", value);
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}

export function useCreateEpreuve() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EpreuveInput) => {
      const res = await api.post<ApiSuccess<Epreuve>>(
        "/epreuves",
        toFormData(input)
      );
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["epreuves"] }),
  });
}

export function useUpdateEpreuve() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<EpreuveInput> & { id: number }) => {
      const res = await api.put<ApiSuccess<Epreuve>>(
        `/epreuves/${id}`,
        toFormData(input)
      );
      return res.data.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["epreuves"] });
      qc.invalidateQueries({ queryKey: ["epreuve", vars.id] });
    },
  });
}

export function useDeleteEpreuve() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/epreuves/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["epreuves"] }),
  });
}
