import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useAnnees, useFilieres, usePoles } from "@/hooks/queries";
import {
  useCreateEpreuve,
  useUpdateEpreuve,
  type EpreuveInput,
} from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/api";
import type { Epreuve } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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

interface EpreuveFormDialogProps {
  trigger: React.ReactNode;
  epreuve?: Epreuve;
}

export function EpreuveFormDialog({ trigger, epreuve }: EpreuveFormDialogProps) {
  const isEdit = !!epreuve;
  const { isSuperAdmin, user } = useAuth();
  const [open, setOpen] = useState(false);

  const { data: filieres } = useFilieres();
  const { data: annees } = useAnnees();
  const { data: poles } = usePoles();
  const createMut = useCreateEpreuve();
  const updateMut = useUpdateEpreuve();
  const loading = createMut.isPending || updateMut.isPending;

  // Pole impose pour un ADMIN (son propre pole), libre pour le SuperAdmin.
  const defaultPoleId = epreuve
    ? String(epreuve.poleId)
    : isSuperAdmin
      ? ""
      : String(user?.poleId ?? "");

  const [form, setForm] = useState({
    matiere: epreuve?.matiere ?? "",
    typeExamen: epreuve?.typeExamen ?? "Examen",
    session: epreuve?.session ?? "NORMALE",
    anneeAcademique: epreuve?.anneeAcademique ?? "",
    poleId: defaultPoleId,
    filiereId: epreuve ? String(epreuve.filiereId) : "",
    anneeId: epreuve ? String(epreuve.anneeId) : "",
  });
  const [fichier, setFichier] = useState<File | null>(null);

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.poleId || !form.filiereId || !form.anneeId) {
      toast.error("Pôle, filière et année sont obligatoires");
      return;
    }
    if (!isEdit && !fichier) {
      toast.error("Le fichier PDF ou DOCX est obligatoire");
      return;
    }

    // Le titre est genere automatiquement: "<type> <matiere>" (ex: "Examen Algorithmique").
    const titre = `${form.typeExamen} ${form.matiere}`.trim();

    const payload: EpreuveInput = {
      titre,
      matiere: form.matiere,
      typeExamen: form.typeExamen || undefined,
      session: form.session as "NORMALE" | "RATTRAPAGE",
      anneeAcademique: form.anneeAcademique,
      poleId: Number(form.poleId),
      filiereId: Number(form.filiereId),
      anneeId: Number(form.anneeId),
      fichier,
    };

    try {
      if (isEdit) {
        await updateMut.mutateAsync({ id: epreuve.id, ...payload });
        toast.success("Épreuve mise à jour");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Épreuve créée");
      }
      setOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'épreuve" : "Nouvelle épreuve"}</DialogTitle>
          <DialogDescription>
            Renseignez les informations et joignez le sujet au format PDF ou DOCX.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.typeExamen}
                onValueChange={(v) => update("typeExamen", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Examen">Examen</SelectItem>
                  <SelectItem value="Devoir">Devoir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="matiere">Matière</Label>
              <Input
                id="matiere"
                required
                value={form.matiere}
                onChange={(e) => update("matiere", e.target.value)}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Titre généré :{" "}
            <span className="font-medium text-foreground">
              {`${form.typeExamen} ${form.matiere}`.trim() || "—"}
            </span>
          </p>

          {isSuperAdmin && (
            <div className="space-y-1.5">
              <Label>Pôle</Label>
              <Select
                value={form.poleId}
                onValueChange={(v) => update("poleId", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un pôle" />
                </SelectTrigger>
                <SelectContent>
                  {poles?.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nom} ({p.pays})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Filière</Label>
              <Select
                value={form.filiereId}
                onValueChange={(v) => update("filiereId", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {filieres?.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Année d'étude</Label>
              <Select
                value={form.anneeId}
                onValueChange={(v) => update("anneeId", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {annees?.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Session</Label>
              <Select
                value={form.session}
                onValueChange={(v) => update("session", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMALE">Normale</SelectItem>
                  <SelectItem value="RATTRAPAGE">Rattrapage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="anneeAcademique">Année acad.</Label>
              <Input
                id="anneeAcademique"
                required
                placeholder="2024-2025"
                value={form.anneeAcademique}
                onChange={(e) => update("anneeAcademique", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fichier">
              Fichier PDF ou DOCX{" "}
              {isEdit && "(laisser vide pour conserver l'actuel)"}
            </Label>
            <Input
              id="fichier"
              type="file"
              accept="application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFichier(e.target.files?.[0] ?? null)}
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
