import DefaultLayout from "@/layouts/default";
import { getOpportunities } from "../../api/getOpportunities.ts";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Opportunity } from "../../interfaces/IOpportunity.ts";
import { toggleFollow } from "../../api/toggleFollow.ts";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { DateFormatter } from "@internationalized/date";
import { Filters } from "../../interfaces/IFilters.ts";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: [],
    publish_date_start: "",
    publish_date_end: ""
  });

  const loadOpportunities = async () => {
    const data = await getOpportunities(filters);
    setOpportunities(data);
  };

  useEffect(() => {
    loadOpportunities();
  }, [filters]);

  // to format in YYYY-MM-DD
  const formatter = new DateFormatter("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const handleDateRange = (range: any) => {
    if (range) {
      const startDate = range.start ? formatter.format(range.start.toDate()) : "";
      const endDate = range.end ? formatter.format(range.end.toDate()) : "";
      setFilters({
        ...filters,
        publish_date_start: startDate,
        publish_date_end: endDate
      });
    } else {
      setFilters({
        ...filters,
        publish_date_start: "",
        publish_date_end: ""
      });
    }
  };

  const handleToggleFollow = async (id: number) => {
    await toggleFollow(id);
    await loadOpportunities();
  };

  console.log("Opportunities", opportunities);

  const columns = [
    { key: "code", label: "Código" },
    { key: "title", label: "Nombre" },
    { key: "type", label: "Tipo" },
    { key: "publish_date", label: "Fecha de publicación" },
    { key: "close_date", label: "Fecha cierre" },
    { key: "actions", label: "Estado" }
  ];


  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block justify-center flex-col flex">
          <span className="text-xl">Oportunidades</span>
          <span className="text-base">Filtros:</span>
          <div className="py-2 flex flex-row justify-between">
            <CheckboxGroup
              label="Tipo"
              value={filters.type}
              orientation="horizontal"
              onValueChange={(values) => setFilters({ ...filters, type: values })}
            >
              <Checkbox value="tender">Licitación</Checkbox>
              <Checkbox value="agile">Compra ágil</Checkbox>
            </CheckboxGroup>
            <DateRangePicker
              aria-label="Rango de fecha de publicación de las oportunidades"
              label="Fecha de publicación"
              onChange={handleDateRange}
              className="max-w-xs"
              firstDayOfWeek="mon"
            ></DateRangePicker>
          </div>

          <Table
            aria-label="Opportunities-table">
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              ))}
            </TableHeader>
            <TableBody
              items={opportunities}
              loadingContent={<div>Cargando Oportunidades...</div>}
              emptyContent={"No se encontraron oportunidades"}
            >{(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "type" ? (
                      item[columnKey] === "tender" ? "Licitación" :
                        item[columnKey] === "agile" ? "Compra ágil" :
                          item[columnKey]
                    ) : columnKey === "publish_date" || columnKey === "close_date" ? (
                      new Date(item[columnKey]).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                      })
                    ) : columnKey === "actions" ? (
                        <Button
                          className="w-full"
                          size="sm"
                          variant={item.is_followed ? "ghost" : "solid"}
                          onPress={() => handleToggleFollow(item.id)}
                        >{item.is_followed ? "Dejar de seguir" : "Seguir"}
                        </Button>
                      )
                      : (
                        item[columnKey as keyof Opportunity]
                      )}

                  </TableCell>
                )}

              </TableRow>
            )}
            </TableBody>
          </Table>
        </div>
      </section>
    </DefaultLayout>
  );
}
