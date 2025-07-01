import { Home, LineChart, Package2, PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const isActiveLink = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClasses = (path: string) => {
    const baseClasses =
      "flex items-center gap-4 px-2.5 py-2 rounded-lg transition-colors";
    const activeClasses = "bg-accent text-accent-foreground";
    const inactiveClasses =
      "text-muted-foreground hover:text-foreground hover:bg-accent/50";

    return `${baseClasses} ${
      isActiveLink(path) ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="max-w-xs p-4">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base mb-4"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">FuelTrip Manager</span>
          </Link>
          <Link
            to="/"
            onClick={handleLinkClick}
            className={getLinkClasses("/")}
          >
            <Home className="h-5 w-5" />
            Inicio
          </Link>
          <Link
            to="/settings"
            onClick={handleLinkClick}
            className={getLinkClasses("/settings")}
          >
            <LineChart className="h-5 w-5" />
            Configuración
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
