import Cookies from 'universal-cookie';
import diff from 'deep-diff';
import moment from "moment";

const cookies = new Cookies();

export const isLoggedIn = () => {
  return cookies.get('access_token');
};

export const deleteCookies = () => {
  cookies.remove('access_token');
  window.location.assign('/');
};

export const getCookies = () => {
  const access_token = cookies.get('access_token') ? cookies.get('access_token') : '';

  if (access_token) {
    return { access_token };
  } else {
    return 'unset';
  }
};

export const strTrunc = (str, length = 50) => {
  try {
    str = str.toString();
    if (str.length > length) {
      return `${str.substr(0, length)}...`
    } else {
      return str;
    }
  } catch (e) {
    return '---'
  }
}

export const getFormattedDate = (createdAt) => {
  return moment(createdAt).format('Do MMM, hh:mm A');
}

export const createDiff = (oldDetails, newDetails) => {
  let finalDiff = {};
  const difference = diff(oldDetails, newDetails);
  if (!difference) {
    return null;
  }
  difference.forEach((elem) => {
    let currentObject = finalDiff;
    for (let i = 0; i < elem.path.length; i++) {
      if (i === elem.path.length - 1) {
        currentObject[elem.path[i]] = elem.rhs;
      } else if (!currentObject[elem.path[i]]) {
        currentObject[elem.path[i]] = {};
      }
      currentObject = currentObject[elem.path[i]];
    }
  });
  return finalDiff;
};
