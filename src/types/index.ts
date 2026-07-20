export type Role = "SUPERADMIN" | "ADMIN";
export type Session = "NORMALE" | "RATTRAPAGE";

export interface Pole {
  id: number;
  nom: string;
  pays: string;
  createdAt: string;
  updatedAt?: string;
  admin?: { id: number; nom: string; email?: string } | null;
  _count?: { epreuves: number };
}

export interface Filiere {
  id: number;
  nom: string;
  description?: string | null;
  _count?: { epreuves: number };
  createdAt?: string;
}

export interface Annee {
  id: number;
  libelle: string;
  ordre: number;
}

export interface Epreuve {
  id: number;
  titre: string;
  matiere: string;
  typeExamen?: string | null;
  session: Session;
  anneeAcademique: string;
  fichierUrl: string;
  fichierNom?: string | null;
  poleId: number;
  filiereId: number;
  anneeId: number;
  publieParId?: number | null;
  dateUpload: string;
  pole?: { id: number; nom: string; pays: string };
  filiere?: { id: number; nom: string };
  annee?: { id: number; libelle: string };
  publiePar?: { id: number; nom: string } | null;
}

export interface Admin {
  id: number;
  nom: string;
  email: string;
  role: Role;
  poleId: number | null;
  pole?: { id: number; nom: string } | null;
  createdAt?: string;
}

export interface AuthUser {
  id: number;
  nom: string;
  email: string;
  role: Role;
  poleId: number | null;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}
