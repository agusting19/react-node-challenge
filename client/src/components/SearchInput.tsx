import { Spinner } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function SearchInput() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Local state for input (for immediate UX)
  const [inputValue, setInputValue] = useState("");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_DELAY = 500; // 500ms delay

  // Synchronize input with URL params on load
  useEffect(() => {
    const searchTerm = searchParams.get("q") || "";
    setInputValue(searchTerm);
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (value: string) => {
      const currentParams = new URLSearchParams(searchParams);

      if (value.trim()) {
        currentParams.set("q", value.trim());
      } else {
        currentParams.delete("q");
      }

      startTransition(() => {
        const basePath = location.pathname;
        const queryString = currentParams.toString();
        navigate(`${basePath}${queryString ? `?${queryString}` : ""}`);
      });
    },
    [searchParams, location.pathname, navigate]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        updateSearchParams(value);
      }, DEBOUNCE_DELAY);
    },
    [updateSearchParams]
  );

  function searchAction(formData: FormData) {
    const value = formData.get("q") as string;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    updateSearchParams(value);
  }

  // Handle real-time input changes with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setInputValue("");
    updateSearchParams("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && inputValue) {
      clearSearch();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      updateSearchParams(inputValue);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const hasSearchTerm = inputValue.trim().length > 0;

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.60rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Buscar por conductor, camión, destino o combustible..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        autoComplete="off"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute right-1 top-1 flex items-center gap-1">
        {hasSearchTerm && !isPending && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive transition-colors"
            title="Limpiar búsqueda (Esc)"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
        {isPending && (
          <div className="h-7 w-7 flex items-center justify-center">
            <Spinner className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </form>
  );
}

export default SearchInput;
