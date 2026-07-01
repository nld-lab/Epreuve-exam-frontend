import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Download, Eye, Search } from "lucide-react";
import { API_URL } from "@/lib/api";
import { useAnnees, useEpreuves, useFilieres, usePoles } from "@/hooks/queries";
import type { EpreuveFilters } from "@/hooks/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "all";

export function EpreuvesPage() {
  const [searchParams] = useSearchParams();
  const initialFiliere = searchParams.get("filiereId");
  const initialPole = searchParams.get("poleId");

  const [q, setQ] = useState("");
  const [poleId, setPoleId] = useState<string>(initialPole ?? ALL);
  const [filiereId, setFiliereId] = useState<string>(initialFiliere ?? ALL);
  const [anneeId, setAnneeId] = useState<string>(ALL);
  const [session, setSession] = useState<string>(ALL);
  const [page, setPage] = useState(1);

  const { data: poles } = usePoles();
  const { data: annees } = useAnnees();
  const { data: filieres } = useFilieres();

  const filters: EpreuveFilters = useMemo(
    () => ({
      page,
      limit: 12,
      q: q || undefined,
      poleId: poleId !== ALL ? Number(poleId) : undefined,
      filiereId: filiereId !== ALL ? Number(filiereId) : undefined,
      anneeId: anneeId !== ALL ? Number(anneeId) : undefined,
      session: session !== ALL ? session : undefined,
    }),
    [page, q, poleId, filiereId, anneeId, session]
  );

  const { data, isLoading, isFetching } = useEpreuves(filters);
  const epreuves = data?.data ?? [];
  const meta = data?.meta;

  const resetPageAnd = (fn: () => void) => {
    setPage(1);
    fn();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Catalogue des épreuves</h1>

      {/* Filtres */}
      <Card>
        <CardContent className="grid gap-3 py-2 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={q}
              onChange={(e) => resetPageAnd(() => setQ(e.target.value))}
            />
          </div>

          <Select
            value={poleId}
            onValueChange={(v) => resetPageAnd(() => setPoleId(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous les pôles</SelectItem>
              {poles?.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filiereId}
            onValueChange={(v) => resetPageAnd(() => setFiliereId(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes les filières</SelectItem>
              {filieres?.map((f) => (
                <SelectItem key={f.id} value={String(f.id)}>
                  {f.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={anneeId}
            onValueChange={(v) => resetPageAnd(() => setAnneeId(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes les années</SelectItem>
              {annees?.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={session}
            onValueChange={(v) => resetPageAnd(() => setSession(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes les sessions</SelectItem>
              <SelectItem value="NORMALE">Normale</SelectItem>
              <SelectItem value="RATTRAPAGE">Rattrapage</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Liste */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : epreuves.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          Aucune épreuve ne correspond à ces critères.
        </p>
      ) : (
        <div
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          {epreuves.map((ep) => (
            <Card key={ep.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium leading-snug">{ep.titre}</h3>
                  <Badge
                    variant={ep.session === "RATTRAPAGE" ? "destructive" : "secondary"}
                  >
                    {ep.session === "RATTRAPAGE" ? "Rattrapage" : "Normale"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ep.matiere} · {ep.annee?.libelle} · {ep.anneeAcademique}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ep.filiere?.nom}
                </p>
                <div className="mt-auto flex gap-2 pt-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to={`/epreuves/${ep.id}`}>
                      <Eye className="size-4" />
                      Détails
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <a
                      href={`${API_URL}/public/epreuves/${ep.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="size-4" />
                      PDF
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
