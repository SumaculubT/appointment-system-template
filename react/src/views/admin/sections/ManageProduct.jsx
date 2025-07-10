import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";
import axiosClient from "../../../axios-client";
import { BiCalendar } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";
import { HiOutlinePencilSquare, HiTableCells } from "react-icons/hi2";
import { CiBoxList, CiViewTable } from "react-icons/ci";
import { FaUserLock } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { LiaEllipsisHSolid } from "react-icons/lia";
import { PulseLoader } from "react-spinners";

const ManageProduct = () => {
  const { products, fetchProducts } = useStateContext();
  const [loading, setLoading] = useState(false);

  const [selectedProductNav, setSelectedProductNav] = useState("all");
  const [today, setToday] = useState(getFormattedDate());
  const [toggleFormat, setToggleFormat] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [filterSuggestion, setFilterSuggestion] = useState([]);

  const getProducts = (
    page = 1,
    category = selectedProductNav,
    search = searchTerm
  ) => {
    setLoading(true);
    axiosClient
      .get("/products", {
        params: {
          page,
          category: category.toLowerCase(),
          search: search,
        },
      })
      .then(({ data }) => {
        fetchProducts(data.data);
        setPagination({
          links: data.meta?.pagination?.links || [],
          meta: data.meta?.pagination,
        });
        setCurrentPage(data.meta?.pagination?.current_page);
        setLoading(false);
        console.log(data.meta?.pagination);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getProducts(1, selectedProductNav, searchTerm);
  }, [selectedProductNav, searchTerm]);

  const infoGraph = [
    {
      name: "Total Sales",
      num: `942,822 Php`,
      info: `+192,000 Php New in this month`,
    },
    {
      name: "All Products",
      num: `52 Products`,
      info: "Current",
    },
    {
      name: "Most Sold",
      num: `4 Employees`,
      info: `Current`,
    },
    {
      name: "Active Users",
      num: `42 Active Users`,
      info: `Current`,
    },
  ];

  const productNav = ["all", "electronics", "clothing", "furniture", "books"];

  const filteredProducts =
    selectedProductNav !== "all"
      ? products.filter((p) => p.category === selectedProductNav.toLowerCase())
      : products;

  function getFormattedDate() {
    return new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(getFormattedDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFilter = (ev) => {
    const search = ev.target.value;
    setSuggestions(search);
    const newFilter = products.filter((value) => {
      return value.name.toLowerCase().includes(search.toLowerCase());
    });
    console.log(suggestions);

    if (search === "") {
      setFilterSuggestion([]);
    } else {
      setFilterSuggestion(newFilter);
    }
  };
  return (
    <>
      <section>
        <div className=" flex flex-row justify-end mb-4 mx-10">
          <div className=" flex flex-row gap-4 ">
            <span className="flex flex-row text-gray-800 py-2 px-8 border border-gray-800 shadow-sm rounded-sm font-semibold">
              <BiCalendar className="h-full items-center mr-2" />
              {today}
            </span>
            <button
              className=" cursor-pointer text-md flex flex-row py-2 px-8 bg-blue-600 text-white shadow-sm rounded-sm font-semibold hover:bg-blue-800 duration-200"
              // onClick={addNew}
            >
              <PiPlus className=" text-xl h-full items-center mr-2" />
              Add new product
            </button>
          </div>
        </div>
        <div className=" flex flex-row w-11/12 m-auto mb-10 gap-10">
          {infoGraph.map((i) => (
            <div
              key={i.name}
              className=" cursor-pointer pr-6 py-4 shadow-sm bg-white w-full rounded-sm flex flex-col hover:shadow-lg duration-100"
            >
              <h3 className=" text-gray-500 text-sm pl-6 font-semibold">
                {i.name}
              </h3>
              <h1 className=" text-gray-800 border-l-3 pl-6 py-2 border-blue-600 text-2xl font-semibold">
                {i.num}
              </h1>
              <h2 className=" text-green-600 pl-6 text-sm font-semibold">
                {i.info}
              </h2>
            </div>
          ))}
        </div>
        <div className=" flex justify-between text-sm font-semibold border-b border-gray-400 w-11/12 m-auto mb-6">
          <div className=" text-sm flex flex-row justify-between w-full gap-10">
            <div className=" flex flex-row gap-6">
              {productNav.map((category) => (
                <a
                  key={category}
                  onClick={() => {
                    setSearchTerm([]);
                    setSelectedProductNav(category);
                  }}
                  className={`cursor-pointer px-2 pb-2 hover:text-blue-500 ${
                    selectedProductNav === category
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </a>
              ))}
            </div>
            <div className=" flex flex-col font-normal text-sm">
              <div className=" flex flex-row h-fit mr-4 bg-white rounded-full text-gray-700 -mt-5 shadow-sm overflow-hidden">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Search item ..."
                  className=" p-2 w-96 rounded-full"
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") {
                      setSearchTerm(suggestions);
                      setFilterSuggestion([]);
                    }
                  }}
                  onChange={handleFilter}
                />
                <a
                  onClick={() => {
                    setSearchTerm(suggestions);
                    setFilterSuggestion([]);
                  }}
                  className=" px-4 my-auto  text-gray-800"
                >
                  <FaMagnifyingGlass size={15} />
                </a>
              </div>
              {filterSuggestion.length !== null && (
                <div className=" absolute flex flex-col mt-5 bg-white w-92 rounded-sm shadow-md text-gray-800 overflow-hidden">
                  {filterSuggestion.slice(0, 15).map((value, index) => {
                    return (
                      <div
                        onClick={() => {
                          setSearchTerm(value.name);
                          setFilterSuggestion([]);
                        }}
                        key={index}
                        className="cursor-pointer p-2 w-full hover:bg-gray-200"
                      >
                        <span>{value.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div
            onClick={() => {
              setToggleFormat(!toggleFormat);
            }}
            className="flex flex-row w-fit h-fit -mt-5 mb-4 text-gray-800 rounded-full shadow-sm hover:shadow-md bg-white"
          >
            <div
              className={`cursor-pointer p-2 rounded-full transition-colors duration-200 ${
                toggleFormat ? "bg-gray-800 shadow-sm text-white" : ""
              }`}
            >
              <CiBoxList size={20} />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-full transition-colors duration-200 ${
                !toggleFormat ? "bg-gray-800 shadow-sm text-white" : ""
              }`}
            >
              <CiViewTable size={20} />
            </div>
          </div>
        </div>
      </section>
      {loading && (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <PulseLoader color="#364153" size={6} />
        </div>
      )}
      {!loading && (
        <section>
          {toggleFormat && (
            <div className="px-6">
              <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white shadow-sm hover:shadow-lg duration-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-40 text-gray-500 text-sm object-cover shadow-sm"
                    />
                    <div className="p-4">
                      <h2 className="text-gray-900 text-md font-semibold mb-1">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 text-xs mb-2">
                        {product.description || "No description available"}
                      </p>
                      <p className="text-gray-800 font-bold">
                        ₱{product.price?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!toggleFormat && (
            <div className="px-6">
              <table className=" w-19/20 text-gray-900 text-left m-auto">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      <input type="checkbox" />
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      Stocks
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-sm font-semibold tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className=" cursor-pointer text-left hover:bg-gray-50"
                    >
                      <td className="pl-2 py-2 whitespace-nowrap text-sm text-gray-900">
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td className="pl-2 py-2 whitespace-nowrap text-sm text-gray-900">
                        <img
                          src={p.image_url || "/placeholder.png"}
                          alt={p.name}
                          className="h-10 w-10 text-gray-500 text-sm object-cover shadow-sm"
                        />
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {p.id}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {p.name}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {p.category}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {p.description}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {p.price}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {p.stock}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex text-lg gap-1 items-center ">
                          <button
                          // onClick={() => viewUserProfile(product)}
                          >
                            <div className="hover:bg-gray-300 text-yellow-600  rounded-full duration-100 p-1">
                              <HiOutlinePencilSquare />
                            </div>
                          </button>
                          <a
                            // onClick={(ev) => onDelete(u)}
                            className=""
                          >
                            <div className="hover:bg-gray-300 text-red-600 rounded-full duration-100 p-1">
                              <GoTrash />
                            </div>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section>
        {pagination.meta && pagination.meta.last_page > 1 && (
          <nav>
            <ul className=" flex flex-row gap-1 w-11/12 m-auto h-full justify-center mt-10">
              {pagination?.meta?.current_page > 2 && (
                <li>
                  <button
                    className="cursor-pointer text-sm text-gray-700 font-semibold px-1 py-2 hover:bg-gray-100 rounded-sm duration-100"
                    onClick={() => {
                      getProducts(1, selectedProductNav);
                    }}
                  >
                    {"< First"}
                  </button>
                </li>
              )}

              {pagination?.meta?.current_page > 1 && (
                <li>
                  <button
                    className="cursor-pointer text-sm text-gray-700 font-semibold px-1 py-2 hover:bg-gray-100 rounded-sm duration-100"
                    onClick={() =>
                      getProducts(currentPage - 1, selectedProductNav)
                    }
                  >
                    Previous
                  </button>
                </li>
              )}

              {pagination.meta &&
                (() => {
                  const totalPages = pagination.meta.last_page;
                  const currentPage = pagination.meta.current_page;
                  const pageButtons = [];

                  const createPageButton = (page) => (
                    <li key={page}>
                      <button
                        onClick={() => getProducts(page)}
                        className={`cursor-pointer px-3 py-1 rounded-sm border border-gray-700 shadow-sm hover:text-white hover:bg-gray-700 duration-100 ${
                          currentPage === page
                            ? "text-white bg-gray-700"
                            : "text-gray-700"
                        }`}
                        disabled={currentPage === page}
                      >
                        {page}
                      </button>
                    </li>
                  );

                  // Always show first page
                  pageButtons.push(createPageButton(1));

                  // Show "..." if current page > 3
                  if (currentPage > 4) {
                    pageButtons.push(
                      <LiaEllipsisHSolid
                        className=" mt-4 text-gray-900"
                        size={20}
                      />
                    );
                  }

                  // Show pages around the current page
                  for (
                    let i = Math.max(2, currentPage - 2);
                    i <= Math.min(totalPages - 1, currentPage + 2);
                    i++
                  ) {
                    pageButtons.push(createPageButton(i));
                  }

                  // Show "..." before last page
                  if (currentPage < totalPages - 3) {
                    pageButtons.push(
                      <LiaEllipsisHSolid
                        className=" mt-4 text-gray-900"
                        size={20}
                      />
                    );
                  }

                  // Always show last page if more than one page
                  if (totalPages > 1) {
                    pageButtons.push(createPageButton(totalPages));
                  }

                  return pageButtons;
                })()}

              {pagination?.meta?.current_page < pagination?.meta?.last_page && (
                <li>
                  <button
                    className="cursor-pointer text-gray-700 font-semibold px-2 py-2 hover:scale-105 duration-100"
                    onClick={() =>
                      getProducts(currentPage + 1, selectedProductNav)
                    }
                  >
                    Next
                  </button>
                </li>
              )}
              {pagination?.meta?.current_page !==
                pagination?.meta?.last_page && (
                <li>
                  <button
                    className="cursor-pointer text-sm text-gray-700 font-semibold py-2 hover:scale-105 duration-300"
                    onClick={() =>
                      getProducts(pagination.meta.last_page, selectedProductNav)
                    }
                  >
                    {"Last >"}
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </section>
    </>
  );
};

export default ManageProduct;
