import { useState } from "react";
import { toast } from "sonner";
import { usePoles } from "@/hooks/queries";
import { useCreateAdmin, useUpdateAdmin } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import type { Admin, Role } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminFormDialogProps {
  trigger: React.ReactNode;
  admin?: Admin;
}

export function AdminFormDialog({ trigger, admin }: AdminFormDialogProps) {
  const isEdit = !!admin;
  const { data: poles } = usePoles();
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState(admin?.nom ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(admin?.role ?? "ADMIN");
  const [poleId, setPoleId] = useState<string>(
    admin?.poleId ? String(admin.poleId) : ""
  );

  const createMut = useCreateAdmin();
  const updateMut = useUpdateAdmin();
  const loading = createMut.isPending || updateMut.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "ADMIN" && !poleId) {
      toast.error("Un administrateur doit être assigné à un pôle");
      return;
    }
    if (!isEdit && !password) {
      toast.error("Le mot de passe est obligatoire");
      return;
    }

    const payload = {
      nom,
      email,
      role,
      poleId: role === "SUPERADMIN" ? null : Number(poleId),
      ...(password ? { password } : {}),
    };

    try {
      if (isEdit) {
        await updateMut.mutateAsync({ id: admin.id, ...payload });
        toast.success("Administrateur mis à jour");
      } else {
        await createMut.mutateAsync({ ...payload, password });
        toast.success("Administrateur créé");
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
            {isEdit ? "Modifier l'administrateur" : "Nouvel administrateur"}
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">
              Mot de passe {isEdit && "(laisser vide pour conserver)"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Rôle</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="SUPERADMIN">SuperAdmin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === "ADMIN" && (
              <div className="space-y-1.5">
                <Label>Pôle</Label>
                <Select value={poleId} onValueChange={setPoleId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    {poles?.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
