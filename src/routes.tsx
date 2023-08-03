// Admin Imports
import { FiUsers } from "react-icons/fi";
import Profile from "views/admin/profile";

// Auth Imports

// Icon Imports
import { AiOutlineClockCircle } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdLogin, MdOutlineTask } from "react-icons/md";
import Attendance from "./views/admin/attendance";
import Task from "./views/admin/task";
import TaskDetail from "./views/admin/task-detail";
import Users from "./views/admin/users";
import SignIn from "./views/auth/SignIn";

const routes: RoutesType[] = [
  {
    name: "Task",
    layout: "/admin",
    path: "task",
    icon: <MdOutlineTask className="h-6 w-6" />,
    component: <Task />,
    showInMenu: true,
    subRoutes: [
      {
        name: "Task Detail",
        layout: "/admin",
        path: "detail/:id",
        component: <TaskDetail />,
      },
    ],
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <FiUsers className="h-6 w-6" />,
    component: <Users />,
    showInMenu: true,
  },
  {
    name: "Attendance",
    layout: "/admin",
    path: "attendance",
    icon: <AiOutlineClockCircle className="h-6 w-6" />,
    component: <Attendance />,
    showInMenu: true,
  },
  // {
  //   name: "Profile",
  //   layout: "/admin",
  //   path: "profile",
  //   icon: <CgProfile className="h-6 w-6" />,
  //   component: <Profile />,
  //   showInMenu: true,
  // },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLogin className="h-6 w-6" />,
    component: <SignIn />,
    showInMenu: false,
  },
];
export default routes;
