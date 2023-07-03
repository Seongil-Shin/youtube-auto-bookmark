const OPTIONS = {
  AUTO_BOOKMARK: "OPTIONS_AUTO_BOOKMARK"
};

function checkOption(): Promise<{
  isOnAutoBookMark: boolean;
  optionChecked: boolean;
}> {
  let isOnAutoBookMark = false;
  let optionChecked = false;
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (chrome.runtime?.id) {
        chrome.storage.local.get([OPTIONS.AUTO_BOOKMARK]).then((result) => {
          if (
            result[OPTIONS.AUTO_BOOKMARK] === "ON" ||
            result[OPTIONS.AUTO_BOOKMARK] === undefined
          ) {
            isOnAutoBookMark = true;
            chrome.storage.local.set({ [OPTIONS.AUTO_BOOKMARK]: "ON" });
          }
          clearInterval(intervalId);
          optionChecked = true;
          resolve({ isOnAutoBookMark, optionChecked });
        });
      }
    }, 500);
  });
}

function deleteOldData() {
  const oneMonthMilliSeconds = 30 * 24 * 60 * 60 * 1000;
  const intervalId = setInterval(() => {
    if (chrome.runtime?.id) {
      chrome.storage.local.get(null, (result) => {
        const shouldRemove = [];
        const oneMonthBefore = Date.now() - oneMonthMilliSeconds;
        Object.entries(result).forEach(([key, value]) => {
          if (
            key !== OPTIONS.AUTO_BOOKMARK &&
            value.lastUpdated < oneMonthBefore
          ) {
            shouldRemove.push(key);
          }
        });
        chrome.storage.local.remove(shouldRemove);
      });
      clearInterval(intervalId);
    }
  }, 500);
}

export default async function init(): Promise<{
  isOnAutoBookMark: boolean;
  optionChecked: boolean;
}> {
  deleteOldData();
  return await checkOption();
}
