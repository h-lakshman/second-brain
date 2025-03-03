import { Box } from "@mui/material";
import NavBar from "./NavBar";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <NavBar />
      {children}
    </Box>
  );
};

export default Layout;
