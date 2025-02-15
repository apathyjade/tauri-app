
import LexicalEditor from "./components/LexicalEditor";
import $css from "./App.module.css";


function App() {

  return (<div className={$css.container}>
    <LexicalEditor onChange={() => {}} />
  </div>);
}

export default App;
