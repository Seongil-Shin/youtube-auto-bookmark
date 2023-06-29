import React, { useEffect } from "react";
import "@pages/options/Options.css";
import { OPTIONS } from "@pages/common/constants";

const Options: React.FC = () => {
  const [isOnAutoBookMark, setIsOnAutoBookMark] = React.useState(true);

  useEffect(() => {
    chrome.storage?.local?.get(OPTIONS.AUTO_BOOKMARk).then((value) => {
      if (value[OPTIONS.AUTO_BOOKMARk] === undefined) {
        setIsOnAutoBookMark(true);
        chrome.storage?.local?.set({ [OPTIONS.AUTO_BOOKMARk]: "ON" });
        return;
      }
      if (value[OPTIONS.AUTO_BOOKMARk] === "ON") {
        setIsOnAutoBookMark(true);
      } else {
        setIsOnAutoBookMark(false);
      }
    });
  }, []);

  const onChangeAutoBookmark = () => {
    chrome.storage?.local?.set({
      [OPTIONS.AUTO_BOOKMARk]: isOnAutoBookMark === true ? "OFF" : "ON"
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
