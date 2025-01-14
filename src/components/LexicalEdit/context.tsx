import React from "react";
import { useContext } from "react";


const EditorContext = React.createContext({

});


const useEditorContext = () => {
  return useContext(EditorContext);
};

export {
  EditorContext, useEditorContext,
};
