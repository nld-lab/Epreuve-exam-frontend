import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { usePoles } from "@/hooks/queries";
import { useDeletePole } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { PoleFormDialog } from "@/components/forms/PoleFormDialog";
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

export function PolesAdminPage() {
  const { data: poles, isLoading } = usePoles();
  const deleteMut = useDeletePole();

  const handleDelete = async (id: number) => {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Pôle supprimé");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pôles"
        description="Gestion des campus (réservé au SuperAdmin)"
        action={
          <PoleFormDialog
            trigger={
              <Button>
                <Plus className="size-4" />
                Nouveau pôle
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
              <TableHead>Pays</TableHead>
              <TableHead>Épreuves</TableHead>
              <TableHead>Administrateur</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : (
              poles?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nom}</TableCell>
                  <TableCell>
                    <Badge variant="default">{p.pays}</Badge>
                  </TableCell>
                  <TableCell>{p._count?.epreuves ?? 0}</TableCell>
                  <TableCell>{p.admin?.nom ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <PoleFormDialog
                        pole={p}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <ConfirmDelete
                        loading={deleteMut.isPending}
                        description={`Supprimer le pôle "${p.nom}" ? Il ne doit plus contenir d'épreuves.`}
                        onConfirm={() => handleDelete(p.id)}
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
