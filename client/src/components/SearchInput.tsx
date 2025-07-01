import { Spinner } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SearchInput() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const location = useLocation();

  function searchAction(formData: FormData) {
    const value = formData.get("q") as string;
    const params = new URLSearchParams({ q: value });
    startTransition(() => {
      const basePath = location.pathname;
      navigate(`${basePath}?${params.toString()}`);
    });
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.60rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Buscar..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        autoComplete="off"
      />
      {isPending && <Spinner />}
    </form>
  );
}

export default SearchInput;
