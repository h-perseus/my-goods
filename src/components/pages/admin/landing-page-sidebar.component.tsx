import { Flex } from '@react-spectrum/layout';
import { ROUTER_PATHS } from '../../../routes';
import { Text } from '@react-spectrum/text';
import classes from './landing-page-sidebar.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';

export const LandingPageSidebar = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const options: any[] = [
    {
      id: 'users',
      name: '로그인정보',
      url: ROUTER_PATHS.ADMIN + ROUTER_PATHS.USERS,
    },
    {
      id: 'connections',
      name: '실시간',
      url: ROUTER_PATHS.ADMIN + ROUTER_PATHS.CONNECTIONS,
    },
    {
      id: 'products',
      name: '상품관리',
      url: ROUTER_PATHS.ADMIN + ROUTER_PATHS.PRODUCTS,
    },

    {
      id: 'requests',
      name: '신청관리',
      url: ROUTER_PATHS.ADMIN + ROUTER_PATHS.REQUESTS,
    },
    
    {
      id: 'domains',
      name: '도메인관리',
      url: ROUTER_PATHS.ADMIN + ROUTER_PATHS.DOMAINS,
    },
    {
      id: 'information',
      name: '정보관리',
      url: ROUTER_PATHS.ADMIN + ROUTER_PATHS.INFORMATION,
    },
  ];

  return (
    <Flex
      direction={'column'}
      UNSAFE_style={{
        padding:
          'var(--spectrum-global-dimension-size-350) var(--spectrum-global-dimension-size-300)',
      }}
    >
      {options.map((section) => (
        <div
          key={'landing-size' + section.id}
          className={`${classes.menuItem} ${
            section.url === location.pathname ? classes.activeMenuItem : ''
          }`}
          onClick={() => navigate(section.url)}
        >
          <Text>{section.name}</Text>
        </div>
      ))}
    </Flex>
  );
};

export default LandingPageSidebar;
