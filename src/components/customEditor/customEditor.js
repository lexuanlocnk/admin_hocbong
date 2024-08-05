import React, { useEffect, useRef } from "react";
import { CKEditor } from "ckeditor4-react";

function CKedtiorCustom({ data, onChangeData }) {
  const editorInstance = useRef(null);

  useEffect(() => {
    if (editorInstance.current && editorInstance.current.getData() !== data) {
      editorInstance.current.setData(data);
    }
  }, [data]);
  return (
    <CKEditor
      config={{
        versionCheck: false,
        extraPlugins: "justify",
      }}
      initData={data}
      onChange={(event) => {
        const newData = event.editor.getData();
        if (newData !== data) {
          onChangeData(newData);
        }
      }}
      onInstanceReady={(event) => {
        editorInstance.current = event.editor;
        event.editor.setData(data);
      }}
    />
  );
}

export default CKedtiorCustom;
