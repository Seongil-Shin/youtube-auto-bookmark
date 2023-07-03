import React, { useEffect } from "react";
import "@pages/options/Options.css";
import { OPTIONS } from "@pages/constants";

const Options: React.FC = () => {
  const [isOnAutoBookMark, setIsOnAutoBookMark] = React.useState(true);

  useEffect(() => {
    chrome.storage?.local?.get(OPTIONS.AUTO_BOOKMARK).then((value) => {
      if (value[OPTIONS.AUTO_BOOKMARK] === undefined) {
        setIsOnAutoBookMark(true);
        chrome.storage?.local?.set({ [OPTIONS.AUTO_BOOKMARK]: "ON" });
        return;
      }
      if (value[OPTIONS.AUTO_BOOKMARK] === "ON") {
        setIsOnAutoBookMark(true);
      } else {
        setIsOnAutoBookMark(false);
      }
    });
  }, []);

  const onChangeAutoBookmark = () => {
    chrome.storage?.local?.set({
      [OPTIONS.AUTO_BOOKMARK]: isOnAutoBookMark === true ? "OFF" : "ON"
    });
    setIsOnAutoBookMark(!isOnAutoBookMark);
  };

  return (
    <div className="container">
      <h2 className="title">Options</h2>
      <div className="inputBox">
        <div className="checkBoxWrapper">
          <input
            type="checkbox"
            id="onAutoBookmark"
            name="onAutoBookmark"
            checked={isOnAutoBookMark}
            onChange={onChangeAutoBookmark}
          />
          <label htmlFor="onAutoBookmark">{isOnAutoBookMark ? "On" : "Off"} Auto Bookmark</label>
        </div>
      </div>
    </div>
  );
};

export default Options;
