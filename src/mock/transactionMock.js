export const transactions = [
  {
    id: "2",
    amount: 300,
    type: "income",
    user: "user id 1",
    category: "category id 1",
    date: new Date(2021, 11, 1),
  },
  {
    id: "4",
    amount: 100,
    type: "expense",
    description: "",
    user: "user id 1",
    category: "category id 2",
    date: new Date(2021, 11, 5),
  },
  {
    id: "1",
    amount: 200,
    type: "income",
    description: "",
    user: "user id 1",
    category: "category id 3",
    date: new Date(),
  },
  {
    id: "3",
    amount: 200,
    type: "expense",
    description: "Description 4",
    user: "user id 1",
    category: "category id 1",
    date: new Date(),
  },
];

const transactionMock = {
  transactions,
};

export default transactionMock;
