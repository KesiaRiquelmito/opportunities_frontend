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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { resetFilters, setDateRange, setType } from "@/store/filterSlice.ts";
import { Divider } from "@heroui/divider";
import { parseDate } from "@internationalized/date";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const filters = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch<AppDispatch>();

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

  const handleToggleFollow = async (id: number) => {
    await toggleFollow(id);
    await loadOpportunities();
  };

  const columns = [
    { key: "code", label: "Código" },
    { key: "title", label: "Nombre" },
    { key: "type", label: "Tipo" },
    { key: "publish_date", label: "Fecha de publicación" },
    { key: "close_date", label: "Fecha cierre" },
    { key: "actions", label: "Estado" }
  ];

  const dateRangeValue = filters.publish_date_start && filters.publish_date_end
    ? {
      start: parseDate(filters.publish_date_start),
      end: parseDate(filters.publish_date_end)
    }
    : null;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="justify-center flex-col flex">
          <span className="text-4xl pb-6">Oportunidades</span>
          <span className="text-lg py-3">Filtros:</span>
          <Divider />
          <div className="py-2 flex flex-row justify-between items-center">
            <CheckboxGroup
              label="Tipo"
              value={filters.type}
              orientation="horizontal"
              onValueChange={(values) => dispatch(setType(values))}
            >
              <Checkbox value="tender">Licitación</Checkbox>
              <Checkbox value="agile">Compra ágil</Checkbox>
            </CheckboxGroup>
            <Divider orientation="vertical" className="h-16" />
            <DateRangePicker
              aria-label="Rango de fecha de publicación de las oportunidades"
              label="Fecha de publicación"
              value={dateRangeValue}
              onChange={(range: any) => {
                const start = range?.start ? formatter.format(range.start.toDate()) : "";
                const end = range?.end ? formatter.format(range.end.toDate()) : "";
                dispatch(setDateRange({ start, end }));
              }}
              className="max-w-xs"
              firstDayOfWeek="mon"
            ></DateRangePicker>
            <Divider orientation="vertical" className="h-16" />
            <Button
              color="danger"
              size="md"
              onPress={() => dispatch(resetFilters())}
            >Limpiar filtros</Button>

          </div>

          <Table
            aria-label="Opportunities-table"
            classNames={{
              base: "min-w-[800px] w-full",
              table: "min-w-[800px] w-full",
              emptyWrapper: "min-w-[400px] w-full"
            }}
          >
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
                          className="w-[120px]"
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
