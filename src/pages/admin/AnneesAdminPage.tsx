import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAnnees } from "@/hooks/queries";
import { useDeleteAnnee } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { AnneeFormDialog } from "@/components/forms/AnneeFormDialog";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export function AnneesAdminPage() {
  const { data: annees, isLoading } = useAnnees();
  const deleteMut = useDeleteAnnee();

  const handleDelete = async (id: number) => {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Année supprimée");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Années d'étude"
        description="Référentiel des niveaux (réservé au SuperAdmin)"
        action={
          <AnneeFormDialog
            trigger={
              <Button>
                <Plus className="size-4" />
                Nouvelle année
              </Button>
            }
          />
        }
      />

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libellé</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : (
              annees?.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.libelle}</TableCell>
                  <TableCell>{a.ordre}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <AnneeFormDialog
                        annee={a}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <ConfirmDelete
                        loading={deleteMut.isPending}
                        description={`Supprimer l'année "${a.libelle}" ?`}
                        onConfirm={() => handleDelete(a.id)}
                      />
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
