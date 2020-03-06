import { isUndefined } from "util";

const key = "gameData"
const defaultValue = undefined;
const storage = {
    save: (newState) => {
        localStorage.setItem(key,JSON.stringify(newState));
    },
    load: (isValid) => {
        const stored = localStorage.getItem(key);
        if(stored === null){
            return defaultValue;
        }
        try{
            let parsed = JSON.parse(stored);
            if(isValid(parsed)){
                return parsed;
            }else{
                return defaultValue;
            }
        }catch(e){
            console.error("Error loading saved state",e);
            return defaultValue;
        }
    }
}

export { storage}