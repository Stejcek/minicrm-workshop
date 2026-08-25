import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Layout } from "./components/Layout";
import { CompaniesPage } from "./pages/CompaniesPage";
import { CompanyDetailPage } from "./pages/CompanyDetailPage";
import { CompanyFormPage } from "./pages/CompanyFormPage";
import { ContactDetailPage } from "./pages/ContactDetailPage";
import { ContactFormPage } from "./pages/ContactFormPage";
import { ContactsPage } from "./pages/ContactsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "kontakty", element: <ContactsPage /> },
      { path: "kontakty/novy", element: <ContactFormPage /> },
      { path: "kontakty/:id", element: <ContactDetailPage /> },
      { path: "kontakty/:id/upravit", element: <ContactFormPage /> },
      { path: "firmy", element: <CompaniesPage /> },
      { path: "firmy/nova", element: <CompanyFormPage /> },
      { path: "firmy/:id", element: <CompanyDetailPage /> },
      { path: "firmy/:id/upravit", element: <CompanyFormPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
