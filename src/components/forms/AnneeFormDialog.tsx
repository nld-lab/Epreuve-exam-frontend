import { useState } from "react";
import { toast } from "sonner";
import { useCreateAnnee, useUpdateAnnee } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import type { Annee } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface AnneeFormDialogProps {
  trigger: React.ReactNode;
  annee?: Annee;
}

export function AnneeFormDialog({ trigger, annee }: AnneeFormDialogProps) {
  const isEdit = !!annee;
  const [open, setOpen] = useState(false);
  const [libelle, setLibelle] = useState(annee?.libelle ?? "");
  const [ordre, setOrdre] = useState(String(annee?.ordre ?? 0));

  const createMut = useCreateAnnee();
  const updateMut = useUpdateAnnee();
  const loading = createMut.isPending || updateMut.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { libelle, ordre: Number(ordre) || 0 };
    try {
      if (isEdit) {
        await updateMut.mutateAsync({ id: annee.id, ...payload });
        toast.success("Année mise à jour");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Année créée");
      }
      setOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier l'année" : "Nouvelle année d'étude"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="libelle">Libellé</Label>
            <Input
              id="libelle"
              required
              placeholder="Licence 1"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ordre">Ordre d'affichage</Label>
            <Input
              id="ordre"
              type="number"
              min={0}
              value={ordre}
              onChange={(e) => setOrdre(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="size-4" />}
              {isEdit ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
