import { ActionButton, Image, View, Selection } from "@adobe/react-spectrum";
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from "@react-spectrum/table";
import ArrowRight from "@spectrum-icons/workflow/ArrowRight";
import Delete from "@spectrum-icons/workflow/Delete";
import { useEffect, useState } from "react";
import * as _ from "lodash";
import { useNavigate } from "react-router-dom";
import { PATHS, ROUTER_PATHS } from "../../../../routes";

let columns = [
  { name: "", key: "product.image", width: 150 },
  { name: "상품명", key: "product.name" },
  { name: "아이디", key: "user.userId", width: 100 },
  { name: "비밀번호", key: "user.password", width: 100 },
  { name: "이름", key: "userName", width: 100 },
  { name: "입력날자", key: "createdAt", width: 150 },
  { name: "상품코드", key: "product.code", width: 100 },
  { name: "", key: "action", width: 100 },
];

export const RequestList = ({
  requests,
  setSelectedRequests,
  handleDeleteItem,
}: {
  requests: any[];
  setSelectedRequests: (ids: string[]) => void;
  handleDeleteItem: (id: string) => void;
}): JSX.Element => {
  const navigate = useNavigate();
  let [tableDensity, setTableDensity] = useState<any>("compact");

  const handleSelectionChange = (newSelection: Selection) => {
    if (newSelection === "all") {
      setSelectedRequests(requests.map((e) => e._id));
    } else {
      const ids: string[] = [];
      newSelection.forEach((e) => ids.push(e as string));
      setSelectedRequests(ids);
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
        <TableBody items={requests as any[]}>
          {(item) => (
            <Row key={item._id}>
              {(key) => {
                if (key === "product.image") {
                  return (
                    <Cell>
                      <Image src={_.get(item, key)} />
                    </Cell>
                  );
                } else if (key === "action") {
                  return (
                    <Cell>
                      <ActionButton
                        isQuiet
                        onPress={() => {
                          navigate(
                            ROUTER_PATHS.ADMIN + PATHS.getRequestUrl(item._id),
                          );
                        }}
                      >
                        <ArrowRight />
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
