import { Button, Flex, View, Selection } from "@adobe/react-spectrum";
import { ProductList } from "./product-list.component";
import { useProducts } from "../../../../api/products/hooks/use-products.hook";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATHS } from "../../../../routes";
import { useProductDelete } from "../../../../api/products/hooks/use-product-delete.hook";
import { useCallback, useState } from "react";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";

export const ProductsComponent = (): JSX.Element => {
  const {products, load} = useProducts({searchOptions: undefined});
  const { delete: deleteProduct, isInProgress } = useProductDelete();
  let [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleDeleteItem = (id: string) => {
    console.log(id)
    deleteProduct([id]).then(() => {
      load();
    }).catch( e => {})
  }

  const handleDeleteProducts = useCallback(() => {
    deleteProduct(selectedProducts).then(() => {
      load();
    }).catch( e => {})
  }, [selectedProducts])

  const navigate = useNavigate();

  if (isInProgress) return <LoadingIndicator></LoadingIndicator>
  return (
    <>
      <Flex
        direction="column"
        flex={1}
        gap="size-100"
        position="relative"
        UNSAFE_style={{ overflow: "hidden" }}
      >
        <Flex gap={"size-100"} marginBottom={'size-200'} justifyContent={'end'}>
          <Button isDisabled={selectedProducts.length === 0} variant="secondary" UNSAFE_style={{ borderRadius: '4px'}} onPress={handleDeleteProducts}>삭제</Button>
          <Button variant="accent" UNSAFE_style={{ borderRadius: '4px'}} style="fill" onPress={() => {navigate(ROUTER_PATHS.ADMIN + ROUTER_PATHS.PRODUCT_CREATE)}}>추가</Button>
        </Flex>
        <View flex={1} minHeight={0} position={"relative"}  overflow={'auto'}>
          {
            <ProductList products={products} setSelectedProducts={setSelectedProducts} handleDeleteItem={handleDeleteItem}></ProductList>
          }
        </View>
      </Flex>
    </>
  );
};
