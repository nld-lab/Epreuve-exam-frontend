import { useState } from "react";
import { toast } from "sonner";
import { useCreatePole, useUpdatePole } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import type { Pole } from "@/types";
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

interface PoleFormDialogProps {
  trigger: React.ReactNode;
  pole?: Pole;
}

export function PoleFormDialog({ trigger, pole }: PoleFormDialogProps) {
  const isEdit = !!pole;
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState(pole?.nom ?? "");
  const [pays, setPays] = useState(pole?.pays ?? "");

  const createMut = useCreatePole();
  const updateMut = useUpdatePole();
  const loading = createMut.isPending || updateMut.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateMut.mutateAsync({ id: pole.id, nom, pays });
        toast.success("Pôle mis à jour");
      } else {
        await createMut.mutateAsync({ nom, pays });
        toast.success("Pôle créé");
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
          <DialogTitle>{isEdit ? "Modifier le pôle" : "Nouveau pôle"}</DialogTitle>
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
            <Label htmlFor="pays">Pays</Label>
            <Input
              id="pays"
              required
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              placeholder="Togo, Bénin, Gabon..."
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
