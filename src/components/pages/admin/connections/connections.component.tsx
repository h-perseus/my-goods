import { Button, Flex, View } from "@adobe/react-spectrum";
import { useConnections } from "../../../../api/connections/hooks/use-connections.hook";
import { ConnectionList } from "./connection-list.component";
import { useCallback, useEffect, useState } from "react";
import { useConnectionDelete } from "../../../../api/connections/hooks/use-connection-delete.hook";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";
import { LOCAL_STORAGE_KEYS } from "../../../../helpers/local-storage-keys";

export const ConnectionsComponent = (): JSX.Element => {
  const { connections, load } = useConnections({ searchOptions: {admin: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED)} });
  const { delete: deleteConnection, isInProgress } = useConnectionDelete();
  let [selectedConnections, setSelectedConnections] = useState<string[]>([]);

  const handleDeleteItem = (id: string) => {
    deleteConnection([id])
      .then(() => {
        load();
      })
      .catch((e) => {});
  };

  const handleDeleteConnections = useCallback(() => {
    deleteConnection(selectedConnections)
      .then(() => {
        load();
      })
      .catch((e) => {});
  }, [selectedConnections]);

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        load();
      } catch (error) {}
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  if (isInProgress) return <LoadingIndicator></LoadingIndicator>;
  return (
    <>
      <Flex
        direction="column"
        flex={1}
        gap="size-100"
        position="relative"
        UNSAFE_style={{ overflow: "hidden" }}
      >
        <Flex gap={"size-100"} marginBottom={"size-200"} justifyContent={"end"}>
          <Button
            isDisabled={selectedConnections.length === 0}
            variant="secondary"
            UNSAFE_style={{ borderRadius: "4px" }}
            onPress={handleDeleteConnections}
          >
            삭제
          </Button>
        </Flex>
        <View flex={1} minHeight={0} position={"relative"} overflow={"auto"}>
          {
            <ConnectionList
              connections={connections}
              setSelectedConnections={setSelectedConnections}
              handleDeleteItem={handleDeleteItem}
            ></ConnectionList>
          }
        </View>
      </Flex>
    </>
  );
};
