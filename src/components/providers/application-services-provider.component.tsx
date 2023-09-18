import { createContext, ReactNode, useContext } from "react";
import { MissingProviderError } from "../../helpers/missing-provider-error";
import { createApiProductService } from "../../api/products/services/api-product-service";
import { createApiRequestService } from "../../api/requests/services/api-request-service";
import { createApiDomainService } from "../../api/domains/services/api-domain-service";
import { createApiUserService } from "../../api/users/services/api-user-service";
import { createApiConnectionService } from "../../api/connections/services/api-connection-service";
import { createApiInformationService } from "../../api/information/services/api-information-service";

export interface ApplicationServicesContextProps {
  productService: any;
  requestService: any;
  domainService: any;
  connectionService: any;
  userService: any;
  informationService: any;
}

interface ApplicationServicesProviderProps
  extends Partial<ApplicationServicesContextProps> {
  children: ReactNode;
}

const ApplicationServiceContext = createContext<
  ApplicationServicesContextProps | undefined
>(undefined);

export const ApplicationServicesProvider = ({
  children,
}: ApplicationServicesProviderProps): JSX.Element => {
  const services = {
    productService: createApiProductService(),
    requestService: createApiRequestService(),
    domainService: createApiDomainService(),
    connectionService: createApiConnectionService(),
    userService: createApiUserService(),
    informationService: createApiInformationService(),
  };

  return (
    <ApplicationServiceContext.Provider value={services}>
      {children}
    </ApplicationServiceContext.Provider>
  );
};

export const useApplicationServices = (): ApplicationServicesContextProps => {
  const context = useContext(ApplicationServiceContext);

  if (context === undefined) {
    throw new MissingProviderError(
      "useApplicationServices",
      "ApplicationServiceProvider",
    );
  }

  return context;
};
