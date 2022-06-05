import {
  Card,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import CountUp from "react-countup";

function RecentTransactionCard({ transactions = [] }) {
  const formatDate = (date) => {
    // console.log("memo date : ", date);
    return format(new Date(date), "dd, MMM yyyy");
  };
  return (
    <Card sx={{ my: 2 }}>
      <CardHeader title="Recent Transaction" sx={{ textAlign: "center" }} />
      <CardContent
        sx={{ overflow: "auto", height: "217px", overflowY: "hidden" }}
      >
        <List dense>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <ListItem key={txn._id} disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={
                      <CountUp
                        end={txn.amount}
                        prefix="₹ "
                        decimals={2}
                        duration={0.1}
                      />
                    }
                  />
                  <Chip
                    size="small"
                    color={txn.type === "expense" ? "error" : "success"}
                    label={txn.category_name}
                    sx={{ mx: 1, fontSize: 10 }}
                  />
                  <Chip
                    size="small"
                    label={formatDate(txn.date)}
                    sx={{ fontSize: 10 }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography variant="h6" align="center">
              No recent transactions
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default RecentTransactionCard;
