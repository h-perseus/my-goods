import { Button, Flex, View } from "@adobe/react-spectrum";
import { useDomains } from "../../../../api/domains/hooks/use-domains.hook";
import { DomainList } from "./domain-list.component";
import { useCallback, useState } from "react";
import { useDomainDelete } from "../../../../api/domains/hooks/use-domain-delete.hook";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATHS } from "../../../../routes";

export const DomainsComponent = (): JSX.Element => {
  const { domains, load } = useDomains({ searchOptions: undefined });
  const { delete: deleteDomain, isInProgress } = useDomainDelete();
  let [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const handleDeleteItem = (id: string) => {
    deleteDomain([id])
      .then(() => {
        load();
      })
      .catch((e) => {});
  };

  const handleDeleteDomains = useCallback(() => {
    deleteDomain(selectedDomains)
      .then(() => {
        load();
      })
      .catch((e) => {});
  }, [selectedDomains]);

  const navigate = useNavigate();

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
            isDisabled={selectedDomains.length === 0}
            variant="secondary"
            UNSAFE_style={{ borderRadius: "4px" }}
            onPress={handleDeleteDomains}
          >
            삭제
          </Button>
          <Button
            variant="accent"
            UNSAFE_style={{ borderRadius: "4px" }}
            style="fill"
            onPress={() => {
              navigate(ROUTER_PATHS.ADMIN + ROUTER_PATHS.DOMAIN_CREATE);
            }}
          >
            추가
          </Button>
        </Flex>
        <View flex={1} minHeight={0} position={"relative"} overflow={"auto"}>
          {
            <DomainList
              domains={domains}
              setSelectedDomains={setSelectedDomains}
              handleDeleteItem={handleDeleteItem}
            ></DomainList>
          }
        </View>
      </Flex>
    </>
  );
};
