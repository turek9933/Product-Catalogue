import { BrowserRouter as Router } from 'react-router-dom';
import RouterConfig from './routes/RouterConfig';
import NavigationMenu from './components/NavigationMenu';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <NavigationMenu />
      <RouterConfig />
      <ToastContainer />
    </Router>
  );
};

export default App;
