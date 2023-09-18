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
import * as _ from "lodash";
import { useEffect, useState } from "react";

let columns = [
  { name: "아이디", key: "userId", width: 100 },
  { name: "비밀번호", key: "password", width: 100 },
  { name: "접속기기", key: "device", width: 100 },
  { name: "입력날자", key: "createdAt", width: 150 },
  { name: "상품코드", key: "product.code" },
  { name: "", key: "action", width: 100 },
];

export const UserList = ({
  users,
  setSelectedUsers,
  handleDeleteItem,
}: {
  users: any[];
  setSelectedUsers: (ids: string[]) => void;
  handleDeleteItem: (id: string) => void;
}): JSX.Element => {
  let [tableDensity, setTableDensity] = useState<any>("compact");

  const handleSelectionChange = (newSelection: Selection) => {
    if (newSelection === "all") {
      setSelectedUsers(users.map((e) => e._id));
    } else {
      const ids: string[] = [];
      newSelection.forEach((e) => ids.push(e as string));
      setSelectedUsers(ids);
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
        <TableBody items={users as any[]}>
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
