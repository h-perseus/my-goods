import { Button, Flex, View } from "@adobe/react-spectrum";
import { useRequests } from "../../../../api/requests/hooks/use-requests.hook";
import { RequestList } from "./request-list.component";
import { useRequestDelete } from "../../../../api/requests/hooks/use-request-delete.hook";
import { useCallback, useState } from "react";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";
import { LOCAL_STORAGE_KEYS } from "../../../../helpers/local-storage-keys";

export const RequestsComponent = (): JSX.Element => {
  const { requests, load } = useRequests({
    searchOptions: {
      admin: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED),
    },
  });
  const { delete: deleteRequest, isInProgress } = useRequestDelete();
  let [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const handleDeleteItem = (id: string) => {
    deleteRequest([id])
      .then(() => {
        load();
      })
      .catch((e) => {});
  };

  const handleDeleteRequests = useCallback(() => {
    deleteRequest(selectedRequests)
      .then(() => {
        load();
      })
      .catch((e) => {});
  }, [selectedRequests]);

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
            isDisabled={selectedRequests.length === 0}
            variant="secondary"
            UNSAFE_style={{ borderRadius: "4px" }}
            onPress={handleDeleteRequests}
          >
            삭제
          </Button>
        </Flex>
        <View flex={1} minHeight={0} position={"relative"} overflow={"auto"}>
          {
            <RequestList
              requests={requests}
              setSelectedRequests={setSelectedRequests}
              handleDeleteItem={handleDeleteItem}
            ></RequestList>
          }
        </View>
      </Flex>
    </>
  );
};
