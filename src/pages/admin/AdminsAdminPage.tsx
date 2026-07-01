import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useAdmins } from "@/hooks/queries";
import { useDeleteAdmin } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { AdminFormDialog } from "@/components/forms/AdminFormDialog";
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

export function AdminsAdminPage() {
  const { user } = useAuth();
  const { data: admins, isLoading } = useAdmins();
  const deleteMut = useDeleteAdmin();

  const handleDelete = async (id: number) => {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Administrateur supprimé");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrateurs"
        description="Créez des comptes et assignez-les à un pôle"
        action={
          <AdminFormDialog
            trigger={
              <Button>
                <Plus className="size-4" />
                Nouvel administrateur
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
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Pôle</TableHead>
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
              admins?.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.nom}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>
                    <Badge variant={a.role === "SUPERADMIN" ? "default" : "secondary"}>
                      {a.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{a.pole?.nom ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <AdminFormDialog
                        admin={a}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      {a.id !== user?.id && (
                        <ConfirmDelete
                          loading={deleteMut.isPending}
                          description={`Supprimer le compte "${a.nom}" ?`}
                          onConfirm={() => handleDelete(a.id)}
                        />
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
