import { ActionButton, Image, Selection, View } from "@adobe/react-spectrum";
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from "@react-spectrum/table";
import Edit from "@spectrum-icons/workflow/Edit";
import Copy from "@spectrum-icons/workflow/Copy";
import Delete from "@spectrum-icons/workflow/Delete";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS, ROUTER_PATHS } from "../../../../routes";
import { useInformation } from "../../../../api/information/hooks/use-information.hook";

let columns = [
  { name: "이미지", key: "image", width: 150 },
  { name: "상품이름", key: "name", width: 200 },
  { name: "상품가격", key: "price", width: 100 },
  { name: "상품주소", key: "address", minWidth: 450 },
  { name: "입력날짜", key: "createdAt", width: 150 },
  { name: "", key: "action", width: 100 },
];

export const ProductList = ({
  products,
  setSelectedProducts,
  handleDeleteItem,
}: {
  products: any[];
  setSelectedProducts: (ids: string[]) => void;
  handleDeleteItem: (id: string) => void;
}): JSX.Element => {
  const navigate = useNavigate();
  let [tableDensity, setTableDensity] = useState<any>("compact");

  const handleSelectionChange = (newSelection: Selection) => {
    if (newSelection === "all") {
      setSelectedProducts(products.map((e) => e._id));
    } else {
      const ids: string[] = [];
      newSelection.forEach((e) => ids.push(e as string));
      setSelectedProducts(ids);
    }
  };

  const handleCopyClick = async (text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (iOS) {
          const range = document.createRange();
          range.selectNodeContents(el);
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
          el.setSelectionRange(0, 999999);
        } else {
          el.select();
        }
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      alert("링크를 복사하였습니다");
    } catch (error) {
      console.error("Failed to copy text: ", error);
      alert("링크복사에 실패하였습니다");
    }
  };

  const { information } = useInformation();

  useEffect(() => {
    setTimeout(() => {
      setTableDensity("spacious");
    }, 1000);
  });

  if (!information) return <></>;

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
        <TableBody items={products as any[]}>
          {(item) => (
            <Row key={item._id}>
              {(key) => {
                if (key === "image") {
                  return (
                    <Cell>
                      <Image src={item[key]} alt={item.name} />
                    </Cell>
                  );
                } else if (key === "action") {
                  return (
                    <Cell>
                      <ActionButton
                        isQuiet
                        onPress={() => {
                          navigate(
                            ROUTER_PATHS.ADMIN +
                              PATHS.getProductEditUrl(item._id),
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
                } else if (key === "address") {
                  return (
                    <Cell>
                      {information &&
                        information.domain &&
                        information.domain.value}
                      ?id={item["code"]}
                      <ActionButton
                        isQuiet
                        onPress={() => {
                          handleCopyClick(
                            `${
                              information &&
                              information.domain &&
                              information.domain.value
                            }?id=${item["code"]}`,
                          );
                        }}
                      >
                        <Copy />
                      </ActionButton>
                    </Cell>
                  );
                } else if (key === "price") {
                  return (
                    <Cell>{new Intl.NumberFormat().format(item[key])}</Cell>
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
