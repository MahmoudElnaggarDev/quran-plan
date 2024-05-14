import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { rows, columns } from "./api";
import "./App.css";

export default function App() {
  const localStorageKey = "selectedKeys";
  const getInitialSelectedKeys = () => {
    const savedKeys = localStorage.getItem(localStorageKey);
    return savedKeys ? new Set(JSON.parse(savedKeys)) : new Set([]);
  };

  const [selectedKeys, setSelectedKeys] = useState(getInitialSelectedKeys);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;
  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return rows.slice(start, end);
  }, [page]);

  useEffect(() => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify(Array.from(selectedKeys)),
    );
  }, [selectedKeys]);

  return (
    <div className="dark flex justify-center items-center text-center font-sf text-white h-screen bg-black overflow-hidden">
      <Table
        aria-label="Quran Plan Table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn align="end" key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={selectedKeys.has(item.key)}
                      onChange={() => {
                        const newSelectedKeys = new Set(selectedKeys);
                        if (newSelectedKeys.has(item.key)) {
                          newSelectedKeys.delete(item.key);
                        } else {
                          newSelectedKeys.add(item.key);
                        }
                        setSelectedKeys(newSelectedKeys);
                      }}
                    />
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
