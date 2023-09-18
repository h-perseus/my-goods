import { ActionButton, View, Selection } from "@adobe/react-spectrum";
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from "@react-spectrum/table";
import Edit from "@spectrum-icons/workflow/Edit";
import Delete from "@spectrum-icons/workflow/Delete";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS, ROUTER_PATHS } from "../../../../routes";

let columns = [
  { name: "도메인", key: "value" },
  // { name: "타입", key: "type", width: 100},
  { name: "상태", key: "status", width: 100 },
  // { name: "사용일", key: "startedAt", width: 150 },
  // { name: "마감일", key: "endedAt", width: 150 },
  { name: "", key: "action", width: 100 },
];

export const DomainList = ({
  domains,
  setSelectedDomains,
  handleDeleteItem,
}: {
  domains: any[];
  setSelectedDomains: (ids: string[]) => void;
  handleDeleteItem: (id: string) => void;
}): JSX.Element => {
  const navigate = useNavigate();
  let [tableDensity, setTableDensity] = useState<any>("compact");

  const handleSelectionChange = (newSelection: Selection) => {
    if (newSelection === "all") {
      setSelectedDomains(domains.map((e) => e._id));
    } else {
      const ids: string[] = [];
      newSelection.forEach((e) => ids.push(e as string));
      setSelectedDomains(ids);
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
        <TableBody items={domains as any[]}>
          {(item) => (
            <Row key={item._id}>
              {(key) => {
                if (key === "action") {
                  return (
                    <Cell>
                      <ActionButton
                        isQuiet
                        onPress={() => {
                          navigate(
                            ROUTER_PATHS.ADMIN +
                              PATHS.getDomainEditUrl(item._id),
                          );
                        }}
                      >
                        <Edit />
                      </ActionButton>
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
                } else {
                  return <Cell>{item[key]}</Cell>;
                }
              }}
            </Row>
          )}
        </TableBody>
      </TableView>
    </View>
  );
};
