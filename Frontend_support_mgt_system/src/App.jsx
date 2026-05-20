import AppRoutes from "./routes/AppRoutes.jsx";
import Header from "../Header.jsx";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <AppRoutes />
    </>
  );
}
export default App;
