import { Pivot, PivotItem, Stack } from '@fluentui/react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Send } from './Views/Send';
import './App.scss';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const handlePivotClick = (item?: PivotItem) => {
    navigate(item?.props.itemKey || '/');
  };
  return (
    <Stack
      horizontalAlign="center"
      styles={{ root: { padding: 12 } }}
      // tokens={{ childrenGap: 24 }}
    >
      <Stack
        tokens={{ childrenGap: 12 }}
        styles={{
          root: {
            width: 500,
            '@media (max-width: 500px)': {
              width: '100%',
            },
          },
        }}
      >
        <Pivot
          selectedKey={location.pathname}
          onLinkClick={handlePivotClick}
          styles={{ text: { fontSize: 18 }, count: { fontSize: 16 } }}
          // linkFormat="tabs"
        >
          <PivotItem headerText="Send" itemKey="/" />
          <PivotItem headerText="Receive" itemKey="/receive" />
        </Pivot>
        <Routes>
          <Route path="/" element={<Send />} />
        </Routes>
      </Stack>
    </Stack>
  );
}
