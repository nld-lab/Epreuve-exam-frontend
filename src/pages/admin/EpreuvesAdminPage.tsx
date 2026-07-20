import { Download, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useEpreuves } from "@/hooks/queries";
import { useDeleteEpreuve } from "@/hooks/mutations";
import { API_URL, getErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { EpreuveFormDialog } from "@/components/forms/EpreuveFormDialog";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export function EpreuvesAdminPage() {
  const { user, isSuperAdmin } = useAuth();
  const { data, isLoading } = useEpreuves({ page: 1, limit: 50 });
  const deleteMut = useDeleteEpreuve();
  const epreuves = data?.data ?? [];

  const canManage = (publieParId?: number | null) =>
    isSuperAdmin || publieParId === user?.id;

  const handleDelete = async (id: number) => {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Épreuve supprimée");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Épreuves"
        description="Ajoutez et gérez vos épreuves (upload PDF)"
        action={
          <EpreuveFormDialog
            trigger={
              <Button>
                <Plus className="size-4" />
                Nouvelle épreuve
              </Button>
            }
          />
        }
      />

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Matière</TableHead>
              <TableHead>Filière</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Année acad.</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : epreuves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Aucune épreuve.
                </TableCell>
              </TableRow>
            ) : (
              epreuves.map((ep) => (
                <TableRow key={ep.id}>
                  <TableCell className="font-medium">{ep.titre}</TableCell>
                  <TableCell>{ep.matiere}</TableCell>
                  <TableCell>{ep.filiere?.nom ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                    className="text-white"
                      variant={ep.session === "RATTRAPAGE" ? "destructive" : "secondary"}
                    >
                      {ep.session === "RATTRAPAGE" ? "Rattrapage" : "Normale"}
                    </Badge>
                  </TableCell>
                  <TableCell>{ep.anneeAcademique}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm" aria-label="Télécharger">
                        <a
                          href={`${API_URL}/public/epreuves/${ep.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="size-4" />
                        </a>
                      </Button>
                      {canManage(ep.publieParId) && (
                        <>
                          <EpreuveFormDialog
                            epreuve={ep}
                            trigger={
                              <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                                <Pencil className="size-4" />
                              </Button>
                            }
                          />
                          <ConfirmDelete
                            loading={deleteMut.isPending}
                            description={`Supprimer l'épreuve "${ep.titre}" ?`}
                            onConfirm={() => handleDelete(ep.id)}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
