import { useState } from "react";
import { toast } from "sonner";
import { useCreateFiliere, useUpdateFiliere } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import type { Filiere } from "@/types";
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

interface FiliereFormDialogProps {
  trigger: React.ReactNode;
  filiere?: Filiere;
}

export function FiliereFormDialog({ trigger, filiere }: FiliereFormDialogProps) {
  const isEdit = !!filiere;
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState(filiere?.nom ?? "");
  const [description, setDescription] = useState(filiere?.description ?? "");

  const createMut = useCreateFiliere();
  const updateMut = useUpdateFiliere();
  const loading = createMut.isPending || updateMut.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateMut.mutateAsync({
          id: filiere.id,
          nom,
          description: description || null,
        });
        toast.success("Filière mise à jour");
      } else {
        await createMut.mutateAsync({
          nom,
          description: description || undefined,
        });
        toast.success("Filière créée");
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
            {isEdit ? "Modifier la filière" : "Nouvelle filière"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
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
