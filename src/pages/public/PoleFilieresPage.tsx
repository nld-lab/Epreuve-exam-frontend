import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, FolderTree } from "lucide-react";
import { useFilieres, usePoles } from "@/hooks/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function PoleFilieresPage() {
  const { poleId } = useParams();
  const id = Number(poleId);
  const { data: poles } = usePoles();
  const { data: filieres, isLoading } = useFilieres();
  const pole = poles?.find((p) => p.id === id);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/">
          <ArrowLeft className="size-4" />
          Retour aux pôles
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">{pole?.nom ?? "Pôle"}</h1>
        {pole && (
          <p className="text-muted-foreground">{pole.pays}</p>
        )}
      </div>

      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FolderTree className="size-5" />
        Filières
      </h2>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filieres?.map((filiere) => (
            <Link
              key={filiere.id}
              to={`/epreuves?poleId=${id}&filiereId=${filiere.id}`}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{filiere.nom}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="size-4" />
                  Voir les épreuves
                </CardContent>
              </Card>
            </Link>
          ))}
          {filieres?.length === 0 && (
            <p className="text-muted-foreground">Aucune filière disponible.</p>
          )}
        </div>
      )}
    </div>
  );
}
