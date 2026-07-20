import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Eye,
  Calendar,
  BookOpen,
  FolderTree,
} from "lucide-react";
import { API_URL, getEpreuvePreviewUrl } from "@/lib/api";
import { useEpreuve } from "@/hooks/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground w-32">{label}</span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

export function EpreuveDetailPage() {
  const { id } = useParams();
  const {
    data: ep,
    isLoading,
    isError,
  } = useEpreuve(id ? Number(id) : undefined);

  return (
    <div className="space-y-6 md:max-w-3xl mx-auto pt-30 px-4">
      <Reveal inView={false} delay={0.05}>
        <Button asChild variant="ghost" size="sm">
          <Link to="/epreuves">
            <ArrowLeft className="size-4" />
            Retour au catalogue
          </Link>
        </Button>
      </Reveal>

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : isError || !ep ? (
        <p className="text-destructive">Épreuve introuvable.</p>
      ) : (
        <Reveal delay={0.12} inView={false} direction="scale">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">{ep.titre}</CardTitle>
                <Badge
                  className="text-white"
                  variant={
                    ep.session === "RATTRAPAGE" ? "destructive" : "secondary"
                  }
                >
                  {ep.session === "RATTRAPAGE" ? "Rattrapage" : "Normale"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={BookOpen} label="Matière" value={ep.matiere} />
              <InfoRow
                icon={FolderTree}
                label="Filière"
                value={ep.filiere?.nom}
              />
              <InfoRow
                icon={Calendar}
                label="Année d'étude"
                value={ep.annee?.libelle}
              />
              <InfoRow
                icon={Calendar}
                label="Année acad."
                value={ep.anneeAcademique}
              />
              <InfoRow icon={BookOpen} label="Type" value={ep.typeExamen} />
              {/* <InfoRow icon={User} label="Publié par" value={ep.publiePar?.nom} /> */}

              <div className="mt-4 flex flex-col gap-4 md:gap-2 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 py-2 md:py-0"
                >
                  <a
                    href={getEpreuvePreviewUrl(ep.fichierUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Eye className="size-4" />
                    Aperçu du PDF
                  </a>
                </Button>
                <Button asChild className="flex-1 py-2 md:py-0">
                  <a
                    href={`${API_URL}/public/epreuves/${ep.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="size-4" />
                    Télécharger
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      )}
    </div>
  );
}
