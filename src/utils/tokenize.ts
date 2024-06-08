import { Dict } from "./types";

const gatherNumber = (substring: string): { numberValue: number, rest: string} => {
  let numberValue = '';
  let rest = '';


  for(let i = 0; i < substring.length; i++) {
    const c = substring[i];

    if(c >= '0' && c <= '9') {
      numberValue += c;
    } else {
      rest = substring.substring(i);
      break;
    }
  }

  return { numberValue: +numberValue, rest };
}


export const tokenize = (str: string): {dictionary: Dict, tokenizedString: string} => {
  let dictionary = {};
  let latestKey = 'a';
  let strIterator = str;
  let tokenizedString = '';

  while(strIterator.length > 0) {
    const c = strIterator[0];

    if(c >= '0' && c <= '9') {
      const { numberValue, rest } = gatherNumber(strIterator);
      dictionary = {...dictionary, [latestKey]: numberValue}
      strIterator = rest;
      tokenizedString = tokenizedString + latestKey;
      latestKey = String.fromCharCode(latestKey.charCodeAt(0) + 1);
    } else {
      strIterator = strIterator.substring(1);
      tokenizedString = tokenizedString + c;
    }
  }

  return {dictionary, tokenizedString};
}
