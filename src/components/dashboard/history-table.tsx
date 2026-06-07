"use client";

import { useEffect, useMemo, useState } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { toast } from "sonner";
import type { IGeneration, PaginatedResponse } from "@/types";

const columnHelper = createColumnHelper<IGeneration>();

const columns = [
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => <span className="font-medium">{truncate(info.getValue(), 36)}</span>,
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => <Badge>{info.getValue().replace("image-prompt", "Prompt")}</Badge>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => <span>{formatDate(info.getValue())}</span>,
  }),
  columnHelper.accessor((row) => row.output, {
    id: "preview",
    header: "Preview",
    cell: (info) => <span className="text-sm text-muted-foreground">{truncate(info.getValue(), 60)}</span>,
  }),
];

export function HistoryTable() {
  const [items, setItems] = useState<IGeneration[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search) params.set("search", search);
      if (filterType) params.set("type", filterType);
      const response = await fetch(`/api/history?${params.toString()}`);
      const result = await response.json();
      if (response.ok) {
        const data = result.data as PaginatedResponse<IGeneration>;
        setItems(data.items);
        setTotalPages(data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, filterType]);

  const table = useReactTable({
    columns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
  });

  async function handleDelete() {
    if (!selected.length) return;
    setLoading(true);
    try {
      const response = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      const result = await response.json();
      if (response.ok) {
        setSelected([]);
        toast.success(`${result.data.deletedCount} item(s) deleted`);
        fetchHistory();
      } else {
        toast.error(result.error || "Failed to delete selected history.");
      }
    } finally {
      setLoading(false);
    }
  }

  const visibleRows = table.getRowModel().rows;

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">History</h2>
            <p className="text-sm text-muted-foreground">Search and manage your saved AI generations.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="grid gap-2">
              <Label htmlFor="search">Search</Label>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Find by title or prompt"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      setPage(1);
                      fetchHistory();
                    }
                  }}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Filter</Label>
              <select
                id="type"
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={filterType}
                onChange={(event) => {
                  setPage(1);
                  setFilterType(event.target.value);
                }}
              >
                <option value="">All types</option>
                <option value="blog">Blog</option>
                <option value="email">Email</option>
                <option value="code">Code</option>
                <option value="image-prompt">Image prompts</option>
              </select>
            </div>
            <Button variant="destructive" onClick={handleDelete} disabled={!selected.length || loading}>
              Delete selected
            </Button>
          </div>
        </div>
      </Card>
      <Card className="rounded-3xl border border-border bg-card p-6">
        {items.length === 0 ? (
          <EmptyState
            title="No history yet"
            description="Generate some AI content to fill your history with actionable items."
          />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-border">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-background">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 font-semibold text-muted-foreground">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition hover:bg-muted/40"
                    onClick={() => {
                      const id = row.original._id;
                      setSelected((current) =>
                        current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
                      );
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 align-top text-sm text-foreground">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
