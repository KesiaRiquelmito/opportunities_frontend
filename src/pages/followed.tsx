import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { useEffect, useState } from "react";
import { Opportunity } from "../../interfaces/IOpportunity.ts";
import { getFollowedOpportunities } from "../../api/getFollowedOpportunities.ts";
import { toggleFollow } from "../../api/toggleFollow.ts";
import { DateFormatter } from "@internationalized/date";
import { DateRangePicker } from "@heroui/date-picker";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Button } from "@heroui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setDateRange, setType } from "@/store/filterSlice.ts";
import { Divider } from "@heroui/divider";

export default function FollowedPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const filters = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch<AppDispatch>();

  const loadOpportunities = async () => {
    const data = await getFollowedOpportunities(filters);
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

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 ">
        <div className="justify-center flex-col flex">
          <span className="text-4xl pb-10">Oportunidades en seguimiento</span>
          <span className="text-lg">Filtros:</span>
          <Divider />
          <div className="py-2 flex flex-row justify-between">
            <CheckboxGroup
              label="Tipo"
              value={filters.type}
              orientation="horizontal"
              onValueChange={(values) => dispatch(setType(values))}
            >
              <Checkbox value="tender">Licitación </Checkbox>
              <Checkbox value="agile">Compra ágil</Checkbox>
            </CheckboxGroup>
            <Divider orientation="vertical" className="h-16" />
            <DateRangePicker
              aria-label="Rango de fecha de publicación de las oportunidades en seguimiento"
              label="Fecha de publicación"
              onChange={(range: any) => {
                const start = range?.start ? formatter.format(range.start.toDate()) : "";
                const end = range?.end ? formatter.format(range.end.toDate()) : "";
                dispatch((setDateRange({ start, end })));
              }}
              className="max-w-xs"
              firstDayOfWeek="mon"
            ></DateRangePicker>
          </div>
          <Table
            aria-label="Opportunities-table"
            fullWidth={true}
            classNames={{
              base: "min-w-[800px] w-full",
              table: "min-w-[800px] w-full",
              emptyWrapper: "min-w-[400px] w-full",
            }}
          >
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              ))}
            </TableHeader>
            <TableBody
              items={opportunities}
              loadingContent={<div>Cargando oportunidades...</div>}
              emptyContent={"No se encontraron oportunidades en seguimiento"}

            >
              {(item) => (
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
                      ) : (
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
