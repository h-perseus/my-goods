import { ActionButton, View, Selection } from "@adobe/react-spectrum";
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from "@react-spectrum/table";
import Delete from "@spectrum-icons/workflow/Delete";
import { useEffect, useState } from "react";
import * as _ from "lodash";

let columns = [
  { name: "IP", key: "ip", width: 150 },
  { name: "상품명", key: "product.name" },
  { name: "위치", key: "page", width: 50 },
  { name: "진행", key: "duration", width: 100 },
  { name: "기기", key: "device", width: 50 },
  { name: "접속시간", key: "createdAt", width: 150 },
  { name: "상품코드", key: "product.code", width: 100 },
  { name: "", key: "action", width: 100 },
];

export const ConnectionList = ({
  connections,
  setSelectedConnections,
  handleDeleteItem,
}: {
  connections: any[];
  setSelectedConnections: (ids: string[]) => void;
  handleDeleteItem: (id: string) => void;
}): JSX.Element => {
  let [tableDensity, setTableDensity] = useState<any>("compact");

  const handleSelectionChange = (newSelection: Selection) => {
    if (newSelection === "all") {
      setSelectedConnections(connections.map((e) => e._id));
    } else {
      const ids: string[] = [];
      newSelection.forEach((e) => ids.push(e as string));
      setSelectedConnections(ids);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setTableDensity("spacious");
    }, 1000);
  });

  return (
    <View>
      <TableView
        width="100%"
        height="100%"
        overflowMode="wrap"
        density={tableDensity}
        selectionMode="multiple"
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader columns={columns}>
          {(column) => <Column width={column.width}>{column.name}</Column>}
        </TableHeader>
        <TableBody items={connections as any[]}>
          {(item) => (
            <Row key={item._id}>
              {(key) => {
                if (key === "action") {
                  return (
                    <Cell>
                      <ActionButton
                        isQuiet
                        onPress={() => {
                          handleDeleteItem(item._id);
                        }}
                      >
                        <Delete />
                      </ActionButton>
                    </Cell>
                  );
                } else if (key === "duration") {
                  return <Cell>{_.get(item, key)}초</Cell>;
                } else if (key === "createdAt") {
                  return (
                    <Cell>
                      {new Intl.DateTimeFormat("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).format(new Date(item[key]))}
                    </Cell>
                  );
                } else {
                  return <Cell>{_.get(item, key)}</Cell>;
                }
              }}
            </Row>
          )}
        </TableBody>
      </TableView>
    </View>
  );
};
