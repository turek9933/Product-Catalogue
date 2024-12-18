import { BrowserRouter as Router } from 'react-router-dom';
import RouterConfig from './routes/RouterConfig';
import NavigationMenu from './components/NavigationMenu';

const App = () => {
  return (
    <Router>
      <NavigationMenu />
      <RouterConfig />
    </Router>
  );
};

export default App;
