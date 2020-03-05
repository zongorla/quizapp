import { isUndefined } from "util";

const key = "gameData"
const storage = {
    save: (newState) => {
        localStorage.setItem(key,JSON.stringify(newState));
    },
    load: () => {
        let stored = localStorage.getItem(key);
        if(stored == null){
            return undefined;
        }
        return JSON.parse(stored);
    }
}

export { storage}