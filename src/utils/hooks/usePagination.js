import { useState, useEffect } from "react";

function usePagination({
  currentPage,
  totalPage,
  nextPage,
  prevPage,
  perPage,
}) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isNext, setIsNext] = useState(null);
  const [isPrev, setIsPrev] = useState(null);

  const goToNext = () => {
    if (isNext) {
      setPage((page) => page + 1);
    }
  };
  const goToPrev = () => {
    if (isPrev) {
      setPage((page) => page - 1);
    }
  };

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [currentPage, page]);
  useEffect(() => {
    if (totalPages !== totalPage) setTotalPages(totalPage);
  }, [totalPage, totalPages]);
  useEffect(() => {
    if (limit !== perPage) setLimit(perPage);
  }, [perPage, limit]);
  useEffect(() => {
    if (isNext !== nextPage) setIsNext(nextPage);
  }, [nextPage, isNext]);
  useEffect(() => {
    if (isPrev !== prevPage) setIsPrev(prevPage);
  }, [prevPage, isPrev]);

  return {
    page,
    totalPages,
    limit,
    isNext,
    isPrev,
    setIsNext,
    setIsPrev,
  };
}

export default usePagination;
