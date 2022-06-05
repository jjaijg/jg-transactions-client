import { Paper } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { randomHexColorWithArray } from "random-hex-color-generator";
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const getChartData = (txns = [], type) => {
  const categoryMapping = {};
  txns.forEach((e) => {
    // console.log(e, e[type], e._id.category_name);
    if (categoryMapping.hasOwnProperty(e._id.category_name)) {
      categoryMapping[e._id.category_name] += e[type];
    } else if (e[type]) {
      categoryMapping[e._id.category_name] = e[type];
    }
  });
  const labels = Object.keys(categoryMapping);
  const data = Object.values(categoryMapping);
  return {
    labels,
    datasets: [
      {
        label: "Amount by Categories",
        data,
        backgroundColor: randomHexColorWithArray(labels.length),
        borderWidth: 1,
      },
    ],
  };
};

export const getOptions = (chartTitle) => ({
  responsive: true,
  // aspectRatio: 1,
  maintainAspectRatio:false,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: chartTitle,
    },
  },
});

function CategoryChart({ transactions = [], type, title }) {
  return (
    <Paper elevation={3} sx={{ py: 2, my: 2, height: 450, overflowY: "auto", aspectRatio:1 }}>
      <Doughnut
        options={getOptions(title)}
        data={getChartData(transactions, type)}
      />
    </Paper>
  );
}

export default CategoryChart;
