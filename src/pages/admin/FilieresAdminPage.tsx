import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { useFilieres } from "@/hooks/queries";
import { useDeleteFiliere } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { FiliereFormDialog } from "@/components/forms/FiliereFormDialog";
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

export function FilieresAdminPage() {
  const { data: filieres, isLoading } = useFilieres();
  const deleteMut = useDeleteFiliere();

  const handleDelete = async (id: number) => {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Filière supprimée");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Filières"
        description="Référentiel global des filières (réservé au SuperAdmin)"
        action={
          <FiliereFormDialog
            trigger={
              <Button>
                <Plus className="size-4" />
                Nouvelle filière
              </Button>
            }
          />
        }
      />

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Épreuves</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : (
              filieres?.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.nom}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {f.description ?? "—"}
                  </TableCell>
                  <TableCell>{f._count?.epreuves ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <FiliereFormDialog
                        filiere={f}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <ConfirmDelete
                        loading={deleteMut.isPending}
                        description={`Supprimer la filière "${f.nom}" ?`}
                        onConfirm={() => handleDelete(f.id)}
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
