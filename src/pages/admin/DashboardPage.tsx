import { Building2, FileText, FolderTree, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useEpreuves, useFilieres, usePoles } from "@/hooks/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { user, isSuperAdmin } = useAuth();
  const { data: poles } = usePoles();
  const { data: filieres } = useFilieres();
  const { data: epreuves } = useEpreuves({ page: 1, limit: 1 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue {user?.nom}
          {!isSuperAdmin && user?.poleId
            ? " — vous gérez votre pôle"
            : isSuperAdmin
              ? " — accès global (SuperAdmin)"
              : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Building2} label="Pôles" value={poles?.length ?? 0} />
        <StatCard icon={FolderTree} label="Filières" value={filieres?.length ?? 0} />
        <StatCard
          icon={FileText}
          label="Épreuves"
          value={epreuves?.meta.total ?? 0}
        />
        {isSuperAdmin && (
          <StatCard icon={Users} label="Rôle" value="SuperAdmin" />
        )}
      </div>
    </div>
  );
}
