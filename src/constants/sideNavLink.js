
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LoginIcon from "@mui/icons-material/Login";

import { COMMON_ROUTES, AUTH_ROUTES } from "./routes";

export const SIDENAV_COMMON = [
  {
    name: "Budgets",
    icon: <CurrencyRupeeIcon />,
    route: COMMON_ROUTES.BUDGETS,
  },
  {
    name: "Categories",
    icon: <CategoryIcon />,
    route: COMMON_ROUTES.CATEGORIES,
  },
  {
    name: "Transactions",
    icon: <ReceiptIcon />,
    route: COMMON_ROUTES.TRANSACTIONS,
  },
];

export const SIDENAV_AUTH = [
  {
    name: "Register",
    icon: <AssignmentIndIcon />,
    route: AUTH_ROUTES.REGISTER,
  },
  { name: "Login", icon: <LoginIcon />, route: AUTH_ROUTES.LOGIN },
];

