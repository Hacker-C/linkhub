import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

export function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search bookmarks..."
        className="pl-10 pr-4 py-2 w-64 rounded-lg focus:ring-primary focus:border-primary"
      />
    </div>
  );
}