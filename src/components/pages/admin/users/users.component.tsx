import { Button, Flex, View } from "@adobe/react-spectrum";
import { useUsers } from "../../../../api/users/hooks/use-users.hook";
import { UserList } from "./user-list.component";
import { useCallback, useState } from "react";
import { useUserDelete } from "../../../../api/users/hooks/use-user-delete.hook";
import { LoadingIndicator } from "../../../shared/loading/loading-indicator.component";

export const UsersComponent = (): JSX.Element => {
  const { users, load } = useUsers({ searchOptions: undefined });
  const { delete: deleteUser, isInProgress } = useUserDelete();
  let [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleDeleteItem = (id: string) => {
    deleteUser([id])
      .then(() => {
        load();
      })
      .catch((e) => {});
  };

  const handleDeleteUsers = useCallback(() => {
    deleteUser(selectedUsers)
      .then(() => {
        load();
      })
      .catch((e) => {});
  }, [selectedUsers]);

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
            isDisabled={selectedUsers.length === 0}
            variant="secondary"
            UNSAFE_style={{ borderRadius: "4px" }}
            onPress={handleDeleteUsers}
          >
            삭제
          </Button>
        </Flex>
        <View flex={1} minHeight={0} position={"relative"} overflow={"auto"}>
          {
            <UserList
              users={users}
              setSelectedUsers={setSelectedUsers}
              handleDeleteItem={handleDeleteItem}
            ></UserList>
          }
        </View>
      </Flex>
    </>
  );
};
