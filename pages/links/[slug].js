import { useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import axios from "axios";
import renderHTML from "react-render-html";
import moment from "moment";
import { API } from "../../config";
import InfiniteScroll from "react-infinite-scroller";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);
  const loadUpdatedLinks = async () => {
    const response = await axios.put(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };
  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div className="row alert alert-primary p-2">
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">{moment(l.createdAt).fromNow()}</span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span className="badge text-success">{c.name}</span>
          ))}
          clicks {l.clicks}
        </div>
      </div>
    ));
  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...response.data.links]);
    console.log("allLinks", allLinks);
    console.log("response.data.links.length", response.data.links.length);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };
  const showPopularLinks = () => {
    let max = 0;
    let l;
    if (allLinks.length === 0) {
      return "Sorry But No Link Available";
    }
    allLinks.forEach((ele) => {
      if (ele.clicks >= max) {
        max = ele.clicks;
        l = ele;
      }
    });

    return (
      <div className="row alert alert-primary p-2 ml-3">
        {l && (
            <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
              <a href={l.url} target="_blank">
                <h5 className="pt-2">{l.title}</h5>
                <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
                  {l.url}
                </h6>
              </a>
            </div>
          ) && (
            <div className="col-md-4 pt-2">
              <span className="pull-right">
                {moment(l.createdAt).fromNow()}
              </span>
            </div>
          ) && (
            <div className="col-md-12">
              <span className="badge text-dark">
                {l.type} / {l.medium}
              </span>
              {l.categories.map((c, i) => (
                <span className="badge text-success">{c.name}</span>
              ))}
              clicks {l.clicks}
            </div>
          )}
      </div>
    );
    // return maxLink;
  };
  return (
    <Layout>
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold">
            {category.name} - URL/Links
          </h1>
          <div className="lead alert alert-secondary pt-4">
            {renderHTML(category.content || "")}
          </div>
        </div>
        <div className="col-md-4">
          <img
            src={category.image.url}
            alt={category.name}
            style={{ width: "auto", maxHeight: "200px" }}
          />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-8">{listOfLinks()}</div>
        <div className="col-md-4">
          <h2 className="lead ml-3">Most popular in {category.name}</h2>
          <h6 className="pt-2 text-success" style={{ fontSize: "15px" }}>
            {showPopularLinks()}
          </h6>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 text-center">
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={size > 0 && size >= limit}
            loader={<img src="/static/images/loading.gif" alt="loading" />}
          ></InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 3;
  console.log(query);
  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linkSkip: skip,
  };
};

export default Links;
