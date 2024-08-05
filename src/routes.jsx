import axios from "axios";
import React, { useEffect } from "react";
import config from "./config.js";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard.jsx"));

//Admin
const Admin = React.lazy(() => import("./views/admin/admin/Admin.jsx"));
const AddAdmin = React.lazy(() => import("./views/admin/admin/AddAdmin.jsx"));
const EditAdmin = React.lazy(() => import("./views/admin/admin/EditAdmin.jsx"));

const AdminInformation = React.lazy(() =>
  import("./views/admin/admin/AdminInfomation.jsx")
);

// Student
const StudentInfo = React.lazy(() => import("./views/student/StudentInfo.jsx"));
const StudentDetail = React.lazy(() =>
  import("./views/student/StudentDetail.jsx")
);

// Sponsor
const SponsorInfo = React.lazy(() => import("./views/sponsor/SponsorInfo.jsx"));

const SponsorDetail = React.lazy(() =>
  import("./views/sponsor/SponsorDetail.jsx")
);

// News
const News = React.lazy(() => import("./views/news/News.jsx"));
const AddNews = React.lazy(() => import("./views/news/AddNews.jsx"));
const EditNews = React.lazy(() => import("./views/news/EditNews.jsx"));

// Home
const AddHomeContent = React.lazy(() =>
  import("./views/home/AddHomeContent.jsx")
);
const EditHomeContent = React.lazy(() =>
  import("./views/home/EditHomeContent.jsx")
);

// Banner
const BannerPosition = React.lazy(() =>
  import("./views/banner/position/BannerPosition.js")
);
const AddBannerPosition = React.lazy(() =>
  import("./views/banner/position/AddBannerPosition.js")
);
const EditBannerPosition = React.lazy(() =>
  import("./views/banner/position/EditBannerPosition.js")
);

const Banner = React.lazy(() => import("./views/banner/banner/Banner.js"));

const AddBanner = React.lazy(() =>
  import("./views/banner/banner/AddBanner.js")
);

const EditBanner = React.lazy(() =>
  import("./views/banner/banner/EditBanner.js")
);

const routes = [
  { path: "/", exact: true, name: "Home", element: Dashboard },

  //admin
  { path: "admin", name: "Admin", element: Admin, exact: true },
  { path: "admin/add", name: "Admin", element: AddAdmin, exact: true },
  {
    path: "admin/edit/:adminId",
    name: "Admin",
    element: EditAdmin,

    key: 14,
  },
  {
    path: "admin/information",
    name: "Admin",
    element: AdminInformation,
    exact: true,
  },

  // student
  { path: "student", name: "Student", element: StudentInfo, exact: true },

  {
    path: "student/detail/:studentId",
    name: "Student",
    element: StudentDetail,
    exact: true,
  },

  // sponsor
  { path: "sponsor", name: "Sponsor", element: SponsorInfo, exact: true },
  {
    path: "sponsor/detail/:sponsorId",
    name: "Sponsor",
    element: SponsorDetail,
    exact: true,
  },

  // news
  { path: "news", name: "News", element: News, exact: true },
  { path: "news/add", name: "News", element: AddNews, exact: true },
  {
    path: "news/edit/:newId",
    name: "News",
    element: EditNews,
    exact: true,
  },

  //home
  { path: "home-content", name: "Home", element: AddHomeContent, exact: true },
  {
    path: "home-content/edit",
    name: "Home",
    element: EditHomeContent,
    exact: true,
  },

  // banner position

  {
    path: "banner-pos",
    name: "BannerPos",
    element: BannerPosition,
    exact: true,
  },

  {
    path: "banner-pos/edit/:posId",
    name: "BannerPos",
    element: EditBannerPosition,
    exact: true,
  },
  {
    path: "banner-pos/add",
    name: "BannerPos",
    element: AddBannerPosition,
    exact: true,
  },

  // banner

  {
    path: "banner",
    name: "Banner",
    element: Banner,
    exact: true,
  },

  {
    path: "banner/add",
    name: "Banner",
    element: AddBanner,
    exact: true,
  },

  {
    path: "banner/edit/:bannerId",
    name: "Banner",
    element: EditBanner,
    exact: true,
  },
];

export default routes;
