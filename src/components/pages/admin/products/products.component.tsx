import { Button, Flex, View, Selection, SearchField } from "@adobe/react-spectrum";
import { ProductList } from "./product-list.component";
import { useProducts } from "../../../../api/products/hooks/use-products.hook";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATHS } from "../../../../routes";
import { useProductDelete } from "../../../../api/products/hooks/use-product-delete.hook";
import { useCallback, useEffect, useState } from "react";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";
import { LOCAL_STORAGE_KEYS } from "../../../../helpers/local-storage-keys";
import { isEmpty } from "../../../../helpers/utils";
import Pagination from "../../../shared/pagination/pagination.component";

export const ProductsComponent = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<any>({admin: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED), page: 1});
  const { products, load, isInProgress: isLoading, totalCount } = useProducts({
    searchOptions
  });
  const { delete: deleteProduct, isInProgress: isDeleting } = useProductDelete();
  const [searchText, setSearchText] = useState<string>(
    searchOptions?.name || ''
  );
  let [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  useEffect(() => {
    const inputElement = document.getElementById("search-input-el");

    if (inputElement) {
      inputElement.focus();
    }
  }, [products])

  useEffect(() => {
    if (currentPage !== searchOptions.page)
    setSearchOptions((prev: any) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage, searchOptions])

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
    deleteProduct([id])
      .then(() => {
        load();
      })
      .catch((e) => {});
  };

  const handleDeleteProducts = useCallback(() => {
    deleteProduct(selectedProducts)
      .then(() => {
        load();
      })
      .catch((e) => {});
  }, [selectedProducts]);

  const navigate = useNavigate();

  if (isLoading || isDeleting) return <LoadingIndicator></LoadingIndicator>;
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
            isDisabled={selectedProducts.length === 0}
            variant="secondary"
            UNSAFE_style={{ borderRadius: "4px" }}
            onPress={handleDeleteProducts}
          >
            삭제
          </Button>
          <Button
            variant="accent"
            UNSAFE_style={{ borderRadius: "4px" }}
            style="fill"
            onPress={() => {
              navigate(ROUTER_PATHS.ADMIN + ROUTER_PATHS.PRODUCT_CREATE);
            }}
          >
            추가
          </Button>
        </Flex>
        <View flex={1} minHeight={0} position={"relative"} overflow={"auto"}>
          {
            <ProductList
              products={products}
              setSelectedProducts={setSelectedProducts}
              handleDeleteItem={handleDeleteItem}
            ></ProductList>
          }
        </View>
        <Flex gap={"size-100"} marginTop={"size-200"} marginBottom={'size-200'} justifyContent={"end"}>
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalCount={ totalCount}></Pagination>
        </Flex>
      </Flex>
    </>
  );
};
