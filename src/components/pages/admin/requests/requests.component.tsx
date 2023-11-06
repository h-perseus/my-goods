import { Button, Flex, SearchField, View } from "@adobe/react-spectrum";
import { useRequests } from "../../../../api/requests/hooks/use-requests.hook";
import { RequestList } from "./request-list.component";
import { useRequestDelete } from "../../../../api/requests/hooks/use-request-delete.hook";
import { useCallback, useEffect, useState } from "react";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";
import { LOCAL_STORAGE_KEYS } from "../../../../helpers/local-storage-keys";
import { isEmpty } from "../../../../helpers/utils";
import Pagination from "../../../shared/pagination/pagination.component";

export const RequestsComponent = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<any>({admin: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED), page: 1});
  const { requests, load, isInProgress: isLoading, totalCount } = useRequests({
    searchOptions
  });
  const { delete: deleteRequest, isInProgress } = useRequestDelete();
  let [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>(
    searchOptions?.name || ''
  );

  useEffect(() => {
    if (currentPage !== searchOptions.page)
    setSearchOptions((prev: any) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage, searchOptions])

  useEffect(() => {
    const inputElement = document.getElementById("search-input-el");

    if (inputElement) {
      inputElement.focus();
    }
  }, [requests])

  const onSubmit = (): void => {
    const text = searchText.trim();
    setSearchText(text);
    setSearchOptions((prev: any) => ({
      ...prev,
      name: text,
    }));
    setCurrentPage(1);
  };
  const onClearField = (): void => {
    setSearchText('');
    setSearchOptions((prev: any) => ({
      ...prev,
      name: '',
    }));
    setCurrentPage(1);
  };

  const onSearchChange = (text: string): void => {
    setSearchText(text);

    if (isEmpty(text)) {
      setSearchOptions((prev: any) => ({
        ...prev,
        name: text,
      }));
      setCurrentPage(1);
    }
  };

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

  if (isInProgress || isLoading) return <LoadingIndicator></LoadingIndicator>;
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
        <SearchField
            value={searchText}
            type="search"
            inputMode="search"
            aria-label="search"
            placeholder="검색"
            id="search-input-el"
            isQuiet={true}
            onClear={onClearField}
            onSubmit={onSubmit}
            onChange={onSearchChange}
            UNSAFE_style={{ width: '100%' }}
          />
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
        <Flex gap={"size-100"} marginTop={"size-200"} marginBottom={'size-200'} justifyContent={"end"}>
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalCount={ totalCount}></Pagination>
        </Flex>
      </Flex>
    </>
  );
};
