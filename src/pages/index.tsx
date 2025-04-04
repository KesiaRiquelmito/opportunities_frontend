import DefaultLayout from "@/layouts/default";
import { getOpportunities } from "../../api/getOpportunities.ts";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Opportunity } from "../../interfaces/IOpportunity.ts";

export default function IndexPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOpportunities();
        setOpportunities(data);
      } catch (error) {
        console.error("Failed to fetch opportunities.", error);
      }
    };
    fetchData();
  }, []);

  console.log("Opportunities", opportunities);

  const columns = [
    { key: "code", label: "Código" },
    { key: "title", label: "Nombre" },
    { key: "type", label: "Tipo" },
    { key: "publish_date", label: "Fecha de publicación" }
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block text-center justify-center">
          <h2>Oportunidades</h2>
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
                    ) : columnKey === "publish_date" ? (
                      new Date(item[columnKey]).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                      })
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
