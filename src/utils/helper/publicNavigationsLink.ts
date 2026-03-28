// Define the interface
interface INavigations {
  [key: string]: {
    name: string;
    path: string;
    icon?: React.ReactNode; 
  };
}

// Export the constant
export const publicNavigations: INavigations = {
  home: {
    name: "Home",
    path: "/",
  },
  products: {
    name: "Become a seller",
    path: "/seller-auth",
  },
  about: {
    name: "LogIn",
    path: "/auth",
  },
  // details: {
  //   name: "Details",
  //   path: "/products/details",
  // },
  // blogDetails: {
  //   name: "Blog Details",
  //   path: "/blog-details",
  // },
  // blogPage: {
  //   name: "Blog Page",
  //   path: "/blog-page",
  // },
};
