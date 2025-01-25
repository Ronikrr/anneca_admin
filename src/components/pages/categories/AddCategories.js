import React, { useEffect, useState } from "react";
import Editor from "../../common/Editor";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { createRecord, fetchList } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { Link, useNavigate } from "react-router-dom";
import { Routing } from "../../shared/constants/routing";

const AddCategories = (props) => {
  const { authUserDetails } = props;
  const navigate = useNavigate();

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [selectCategory, setSelectCategory] = useState(false);
  const [selectCategory_id, setSelectCategory_id] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const [categoriDetail, setCategoriDetail] = useState({
    name: "",
    description: "",
    image: null,
    image_url: null,
    status: 0,
    include_in_nav: 1,
    parent_category: "",
    url_key: "",
    meta_title: "",
    meta_keywords: "",
    meta_description: "",
    position: ""
  });

  const handleCategoryDetail = (e) => {
    setCategoriDetail({ ...categoriDetail, [e.target.name]: e.target.value });
  }

  const handleSubmit = async () => {
    setLoading(true);

    const result = await createRecord({
      name: categoriDetail.name,
      description: categoriDetail.description,
      status: categoriDetail.status,
      meta_title: categoriDetail.price,
      meta_description: categoriDetail.meta_description,
      parent_category: categoriDetail.parent_category,
      meta_keywords: categoriDetail.meta_keywords,
      url_key: categoriDetail.url_key
    }, ApiEndPoints.ADD_CATEGORIS);
    if (result?.status === 201) {
      setLoading(false);
      navigate(Routing.Categories);
      toast.success(result?.message);
    } else {
      setLoading(false);
      toast.error(result?.message);
    }
  };
  
  console.log("🚀 ~ getCategorisList ~ result:", categoryList)
  const getCategorisList = async () => {
    const result = await fetchList(
      ApiEndPoints.GET_CATEGORIS
    );
    console.log("🚀 ~ getCategorisList ~ result.data:", result)
    if (result?.status === 200) {
      const list = [];
      for (var j in result.data) {
        list.push({
          name: result.data[j].name,
          id: result.data[j]._id,
        });
      }
      setCategoryList(list);
    } else {
      setCategoryList([]);
    }
  }

  useEffect(() => {
    getCategorisList();
  }, [selectCategory]);

  return (
    <>
      <div className="max-w-100 main-content-inner" style={{ paddingTop: 0 }}>
        <div className="page-heading flex justify-between items-center">
          <div className="flex justify-start space-x-1 items-center">
            <Link
              to="/categories"
              className="breadcrum-icon border block border-border rounded mr-075"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="text-icon"
                  viewBox="0 0 20 20"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path d="M17 9H5.414l3.293-3.293a.999.999 0 1 0-1.414-1.414l-5 5a.999.999 0 0 0 0 1.414l5 5a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L5.414 11H17a1 1 0 1 0 0-2z" />
                </svg>
              </span>
            </Link>
            <div className="self-center">
              <h1 className="page-heading-title">Create A New category</h1>
            </div>
          </div>
          <div className="flex justify-end space-x-1 items-center" />
        </div>
        <div>
          <div className="grid grid-cols-3 gap-x-2 grid-flow-row ">
            <div className="col-span-2 grid grid-cols-1 gap-2 auto-rows-max">
              <div className="card shadow">
                <div className="flex justify-between card-header">
                  <h2 className="card-title">General</h2>
                </div>
                <div className="card-section border-b box-border">
                  <div className="card-session-content pt-lg">
                    <div className="">
                      <div className="form-field-container null">
                        <label htmlFor="name">Name</label>
                        <div className="field-wrapper flex flex-grow">
                          <input
                            type="text"
                            name="name"
                            onChange={handleCategoryDetail}
                            value={categoriDetail.name}
                            defaultValue=""
                          />
                          <div className="field-border" />
                        </div>
                      </div>
                      <div className="ckeditor">
                        <label htmlFor="description">Description</label>

                        <Editor
                          name="description"
                          onChange={(data) => {
                            setCategoriDetail((option) => ({
                              ...option,
                              description: data,
                            }));
                          }}
                          editorLoaded={editorLoaded}
                        />
                      </div>
                      {/* Parent Category */}
                    <div className="form-field-container">
                      <label htmlFor="parent_category">Parent Category</label>
                      <select name="parent_category" onChange={handleCategoryDetail} value={categoriDetail.parent_category}>
                        <option value="">None</option>
                        {categoryList.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card shadow">
                <div className="flex justify-between card-header">
                  <h2 className="card-title">Search engine optimize</h2>
                </div>
                <div className="card-section border-b box-border">
                  <div className="card-session-content pt-lg">
                    <div className="">
                      <div className="form-field-container null">
                        <label htmlFor="url_key">Url key</label>
                        <div className="field-wrapper flex flex-grow">
                          <input
                            type="text"
                            name="url_key"
                            onChange={handleCategoryDetail}
                            value={categoriDetail.url_key}
                            defaultValue=""
                          />
                          <div className="field-border" />
                        </div>
                      </div>
                      <div className="form-field-container null">
                        <label htmlFor="meta_title">Meta title</label>
                        <div className="field-wrapper flex flex-grow">
                          <input
                            type="text"
                            name="meta_title"
                            onChange={handleCategoryDetail}
                            value={categoriDetail.meta_title}
                            defaultValue=""
                          />
                          <div className="field-border" />
                        </div>
                      </div>
                      <div className="form-field-container null">
                        <label htmlFor="meta_keywords">Meta keywords</label>
                        <div className="field-wrapper flex flex-grow">
                          <input
                            value={categoriDetail.meta_keywords}
                            type="text"
                            onChange={handleCategoryDetail}
                            name="meta_keywords"
                            defaultValue=""
                          />
                          <div className="field-border" />
                        </div>
                      </div>
                      <div className="form-field-container null">
                        <label htmlFor="meta_description">
                          Meta description
                        </label>
                        <div className="field-wrapper flex flex-grow">
                          <textarea
                            type="text"
                            value={categoriDetail.meta_description}
                            className="form-field"
                            onChange={handleCategoryDetail}
                            id="meta_description"
                            name="meta_description"
                            defaultValue={""}
                          />
                          <div className="field-border" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 grid grid-cols-1 gap-2 auto-rows-max">
              <div className="card shadow">
                <div className="card-section border-b box-border">
                  <div className="flex justify-between card-section-header mb-1">
                    <h3 className="card-session-title">Status</h3>
                  </div>
                  <div className="card-session-content pt-lg">
                    <div className="form-field-container null">
                      <div className="field-wrapper radio-field">
                        <div>
                          <label htmlFor="status0" className="flex">
                            <input
                              type="radio"
                              name="status"
                              id="status0"
                              value={0}
                              checked={categoriDetail.status === 0}
                              onChange={(e) =>
                                setCategoriDetail((option) => ({
                                  ...option,
                                  status: 0,
                                }))
                              }
                            />
                            <span className="radio-checked">
                              <span />
                            </span>
                            <span className="pl-1">Disabled</span>
                          </label>
                        </div>
                        <div>
                          <label htmlFor="status1" className="flex">
                            <input
                              type="radio"
                              name="status"
                              id="status1"
                              value={1}
                              checked={categoriDetail.status === 1}
                              onChange={(e) =>
                                setCategoriDetail((option) => ({
                                  ...option,
                                  status: 1,
                                }))
                              }
                            />
                            <span className="radio-checked">
                              <span />
                            </span>
                            <span className="pl-1">Enabled</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-section border-b box-border">
                  <div className="flex justify-between card-section-header mb-1">
                    <h3 className="card-session-title">
                      Include In Store Menu
                    </h3>
                  </div>
                  <div className="card-session-content pt-lg">
                    <div className="form-field-container null">
                      <div className="field-wrapper radio-field">
                        <div>
                          <label htmlFor="include_in_nav0" className="flex">
                            <input
                              type="radio"
                              name="include_in_nav"
                              id="include_in_nav0"
                              value={0}
                              checked={
                                categoriDetail.include_in_nav === 0
                              }
                              onChange={(e) =>
                                setCategoriDetail((option) => ({
                                  ...option,
                                  include_in_nav: 0,
                                }))
                              }
                            />
                            <span className="radio-checked">
                              <span />
                            </span>
                            <span className="pl-1">No</span>
                          </label>
                        </div>
                        <div>
                          <label htmlFor="include_in_nav1" className="flex">
                            <input
                              type="radio"
                              name="include_in_nav"
                              id="include_in_nav1"
                              value={1}
                              checked={
                                categoriDetail.include_in_nav === 1
                              }
                              onChange={(e) =>
                                setCategoriDetail((option) => ({
                                  ...option,
                                  include_in_nav: 1,
                                }))
                              }
                            />
                            <span className="radio-checked">
                              <span />
                            </span>
                            <span className="pl-1">Yes</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-submit-button flex border-t border-divider mt-15 pt-15 justify-between">
            <button type="button" className="button critical outline">
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="button primary"
            >
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authUserDetails: state.auth.userInfo,
  };
};
export default connect(mapStateToProps)(AddCategories);
