import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { fetchList } from "../../apis/services/CommonApiService";

const Categories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [checked, setChecked] = useState(0);
  const [selected, setSelected] = useState([]);

  const [searchFilters, setSearchFilters] = useState({
    searchText: "",
    status: "",
    include_in_nav: "",
    total_items: "",
    total_pages: "",
    current_page_item: "",
    page_no: "",
    items_per_page: "",
  });

  useEffect(() => {
    const data = categoryList.filter((item) => item.select === 1);
    setSelected(data);
    if (data.length === categoryList.length) {
      setChecked(1);
    } else {
      setChecked(0);
    }
  }, [categoryList, checked]);

  const getCategorisList = useCallback(async () => {
    const result = await fetchList(
      ApiEndPoints.GET_CATEGORIS
    );
    if (result?.status === 200) {
      const list = [];
      for (var j in result.data) {
        list.push({
          name: result.data[j].name,
          status: result.data[j].status,
          include_in_menu: result.data[j].include_in_store_menu,
          id: result.data[j]._id,
          select: 0,
        });
      }
      setCategoryList(list);
      setSearchFilters((option) => ({
        ...option,
        total_items: result?.totalCategorysCount,
        total_pages: result?.totalPages,
        current_page_item: result?.countCategory,
        page_no: result?.currentPage,
        items_per_page: 10,
      }));
    } else {
      setCategoryList([]);
    }
  }, [
    searchFilters.include_in_nav,
    searchFilters.status,
    searchFilters.searchText,
    searchFilters.page_no,
    searchFilters.items_per_page,
  ]);

  useEffect(() => {
    getCategorisList();
  }, [getCategorisList]);

  return (
    <>
      <div className="page-heading-2 flex justify-between items-center">
        <div className="flex justify-start space-x-1 items-center">
          <div className="self-center">
            <h1 className="page-heading-title">Categories</h1>
          </div>
        </div>
        <div className="flex justify-end space-x-1 items-center">
          <Link to="/categories/new" className="button primary">
            <span>New Category</span>
          </Link>
        </div>
      </div>
      <div className="card shadow">
        <table className="listing sticky">
          <thead>
            <tr>
              <th className="align-bottom">
                <div className="form-field-container null">
                  <div className="field-wrapper radio-field">
                    <label>
                      <input
                        type="checkbox"
                        value={checked}
                        checked={checked === 1 ? true : false}
                        onChange={(e) => {
                          categoryList.forEach((elements, index) => {
                            categoryList[index].select =
                              e.target.checked === true ? 1 : 0;
                          });
                          setChecked(e.target.checked === true ? 1 : 0);
                        }}
                      />
                      <span className="checkbox-checked">
                        {checked !== 0 && (
                          <svg
                            viewBox="0 0 20 20"
                            focusable="false"
                            aria-hidden="true"
                          >
                            <path d="m8.315 13.859-3.182-3.417a.506.506 0 0 1 0-.684l.643-.683a.437.437 0 0 1 .642 0l2.22 2.393 4.942-5.327a.436.436 0 0 1 .643 0l.643.684a.504.504 0 0 1 0 .683l-5.91 6.35a.437.437 0 0 1-.642 0" />
                          </svg>
                        )}
                      </span>
                      <span className="pl-05" />
                    </label>
                  </div>
                </div>
              </th>
              <th className="column">
                <div className="table-header id-header">
                  <div className="title" style={{ marginBottom: "1rem" }}>
                    <span>Category Name</span>
                  </div>
                  <div className="filter" style={{ width: "15rem" }}>
                    <div className="form-field-container null">
                      <div className="field-wrapper flex flex-grow">
                        <input
                          type="text"
                          onChange={(e) => {
                            setSearchFilters((prev) => ({
                              ...prev,
                              searchText: e.target.value,
                            }))
                          }}
                          value={searchFilters.searchText}
                          placeholder="Category Name"
                        />
                        <div className="field-border" />
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th className="column">
                <div className="table-header status-header">
                  <div className="title" style={{ marginBottom: "1rem" }}>
                    <span>Status</span>
                  </div>
                  <div className="filter">
                    <div className="form-field-container dropdown null">
                      <div className="field-wrapper flex flex-grow items-baseline">
                        <select
                          className="form-field"
                          onChange={(e) => {
                            setSearchFilters((option) => ({
                              ...option,
                              status: e.target.value,
                            }));
                          }}
                        >
                          <option value="">All</option>
                          <option value={1}>Enabled</option>
                          <option value={0}>Disabled</option>
                        </select>
                        <div className="field-border" />
                        <div className="field-suffix">
                          <svg
                            viewBox="0 0 20 20"
                            width="1rem"
                            height="1.25rem"
                            focusable="false"
                            aria-hidden="true"
                          >
                            <path d="m10 16-4-4h8l-4 4zm0-12 4 4H6l4-4z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th className="column">
                <div className="table-header status-header">
                  <div className="title" style={{ marginBottom: "1rem" }}>
                    <span>Include In Menu</span>
                  </div>
                  <div className="filter">
                    <div className="form-field-container dropdown null">
                      <div className="field-wrapper flex flex-grow items-baseline">
                        <select
                          className="form-field"
                          onChange={(e) => {
                            setSearchFilters((option) => ({
                              ...option,
                              include_in_nav: e.target.value,
                            }));
                          }}
                        >
                          <option value="">All</option>
                          <option value={1}>Yes</option>
                          <option value={0}>No</option>
                        </select>
                        <div className="field-border" />
                        <div className="field-suffix">
                          <svg
                            viewBox="0 0 20 20"
                            width="1rem"
                            height="1.25rem"
                            focusable="false"
                            aria-hidden="true"
                          >
                            <path d="m10 16-4-4h8l-4 4zm0-12 4 4H6l4-4z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {selected.length > 0 && (
              <tr>
                <td colSpan={100} style={{ borderTop: 0 }}>
                  <div className="inline-flex border border-divider rounded justify-items-start">
                    <a
                      href="#"
                      className="font-semibold pt-075 pb-075 pl-15 pr-15"
                    >
                      {selected.length} selected
                    </a>
                    <a
                      href="#"
                      className="font-semibold pt-075 pb-075 pl-15 pr-15 block border-l border-divider self-center"
                    >
                      <span>Delete</span>
                    </a>
                  </div>
                </td>
              </tr>
            )}
            {categoryList &&
              categoryList.map((item, index) => (
                <tr>
                  <td style={{ width: "2rem" }}>
                    <div className="form-field-container null">
                      <div className="field-wrapper radio-field">
                        <label>
                          <input
                            type="checkbox"
                            value={item.select}
                            checked={item.select === 1 ? true : false}
                            onChange={(e) => {
                              setChecked(0);
                              setCategoryList(
                                categoryList.map((items, index1) =>
                                  index1 === index
                                    ? {
                                      ...items,
                                      select:
                                        e.target.checked === true ? 1 : 0,
                                    }
                                    : items
                                )
                              );
                            }}
                          />
                          <span className="checkbox-checked">
                            {item.select !== 0 && (
                              <svg
                                viewBox="0 0 20 20"
                                focusable="false"
                                aria-hidden="true"
                              >
                                <path d="m8.315 13.859-3.182-3.417a.506.506 0 0 1 0-.684l.643-.683a.437.437 0 0 1 .642 0l2.22 2.393 4.942-5.327a.436.436 0 0 1 .643 0l.643.684a.504.504 0 0 1 0 .683l-5.91 6.35a.437.437 0 0 1-.642 0" />
                              </svg>
                            )}
                          </span>
                          <span className="pl-05" />
                        </label>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <a
                        className="hover:underline font-semibold"
                        href="/admin/categories/edit/b26a23c0-4e7d-455c-84dc-acb3bc8cb11b"
                      >
                        {item.name}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center">
                      <span
                        className={`${item.status === 0 ? "critical" : "success"
                          } dot`}
                        style={{ width: "1.2rem", height: "1.2rem" }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="nodejscart-switch">
                      <div className="flex justify-center">
                        <span>{item.include_in_menu === 0 ? "No" : "Yes"}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="pagination flex px-2">
          <div className="flex justify-between w-full space-x-1 mt-1 mb-1">
            <div className="flex space-x-1">
              <div className="self-center">
                <span>Show</span>
              </div>
              <div className="limit">
                <div className="" style={{ width: "5rem" }}>
                  <div className="form-field-container null">
                    <div className="field-wrapper flex flex-grow">
                      <input
                        type="text"
                        onChange={(e) => {
                          setSearchFilters((option) => ({
                            ...option,
                            items_per_page: e.target.value,
                          }));
                        }}
                        value={searchFilters.items_per_page}
                      />
                      <div className="field-border" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-center">
                <span>per page</span>
              </div>
            </div>
            <div className="flex space-x-1">
              {
                searchFilters.page_no > 1 &&
                <>
                  <div className="first self-center">
                    <a onClick={() => {
                      setSearchFilters((option) => ({
                        ...option,
                        page_no: 1,
                      }));
                    }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        width="20"
                        height="20"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  <div className="prev self-center">
                    <a onClick={() => {
                      setSearchFilters((option) => ({
                        ...option,
                        page_no: searchFilters.page_no - 1,
                      }));
                    }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 19l-7-7 7-7"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </>
              }
              <div className="current" style={{ width: "5rem" }}>
                <div className="form-field-container dropdown null">
                  <div className="field-wrapper flex flex-grow items-baseline">
                    <select value={searchFilters.page_no} onChange={(e) => {
                      setSearchFilters((option) => ({
                        ...option,
                        page_no: e.target.value,
                      }));
                    }} className="form-field">
                      {[...Array(searchFilters.total_pages)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>{index + 1}</option>
                      ))}
                    </select>
                    <div className="field-border"></div>
                    <div className="field-suffix">
                      <svg
                        viewBox="0 0 20 20"
                        width="1rem"
                        height="1.25rem"
                        focusable="false"
                        aria-hidden="true"
                      >
                        <path d="m10 16-4-4h8l-4 4zm0-12 4 4H6l4-4z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              {
                searchFilters.page_no < searchFilters.total_pages &&
                <>
                  <div className="next self-center">
                    <a onClick={() => {
                      setSearchFilters((option) => ({
                        ...option,
                        page_no: searchFilters.page_no + 1,
                      }));
                    }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  <div className="last self-center">
                    <a onClick={() => {
                      setSearchFilters((option) => ({
                        ...option,
                        page_no: searchFilters.total_pages,
                      }));
                    }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        width="20"
                        height="20"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </>
              }

              <div className="self-center">{searchFilters.total_items} records</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
