const inputElementValue = document.getElementById('urlValue');
const urlListElement = document.getElementById('url-list');
const buttonElement = document.getElementById('submit');
const currentURLElement = document.getElementById('currentURL');

let isNewlyCreated = false;
let currentUrlID = '';
let isCurrentUrlDeleted = false;
let previousCurrentUrlID = '';

buttonElement.addEventListener('click', () => {
  const inputValue = inputElementValue.value;
  createURLShortener(inputValue);
  inputElementValue.value = '';
});

const deleteURL = async (id) => {
  if (id) {
    await fetch(`/api/v1/urls/${id}`, { method: 'DELETE' });
    createURLsList([], true);
    if (id === currentUrlID) {
      isCurrentUrlDeleted = true;
      isNewlyCreated = false;
    }
  }
};

const getURLsData = async () => {
  try {
    const response = await fetch('/api/v1/urls');
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const createURLShortener = async (long_url) => {
  if (long_url) {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ long_url }),
    };
    await fetch('/api/v1/urls', postData);
    createURLsList([], true);
    isNewlyCreated = true;
    isCurrentUrlDeleted = false;
  }
};

let urlsDataList = [];

getURLsData().then((data) => {
  urlsDataList = data;
  createURLsList(urlsDataList, false);
});

const createURLsList = (urlsDataList, isFetchRequired) => {
  deleteChildNodes();
  if (isFetchRequired) {
    let urlsDataList = [];
    getURLsData().then((data) => {
      urlsDataList = data;
      previousCurrentUrlID = currentUrlID;
      if (urlsDataList.length > 0) currentUrlID = urlsDataList[0].id;
      createURLsList(urlsDataList, false);
    });
  } else if (urlsDataList.length > 0) {
    urlsDataList.map((url, i) => {
      const divEle = document.createElement('div');
      const divOuterEle = document.createElement('div');
      const deleteDivEle = document.createElement('div');
      const buttonWrapDivEle = document.createElement('div');
      const copyDivEle = document.createElement('div');
      const previousDivEle = document.createElement('div');
      const shortParaEle = document.createElement('p');
      const longParaEle = document.createElement('p');

      divEle.classList.add(
        'lg:w-max',
        'flex',
        'flex-col',
        'items-start',
        'flex-1'
      );

      const anchorEle = document.createElement('a');
      const longAnchorEle = document.createElement('a');

      shortParaEle.innerHTML = 'Short URL';
      longParaEle.innerHTML = 'Long URL';

      // add styles to paragraphs
      shortParaEle.classList.add('text-sm', 'text-gray-600');
      longParaEle.classList.add('text-sm', 'text-gray-600');

      const link = document.createTextNode(`${url.id}`);
      const longLink = document.createTextNode(`${url.long_url}`);

      anchorEle.appendChild(link);
      anchorEle.title = `${window.location.origin}/${url.id}`;
      anchorEle.href = `${window.location.origin}/api/v1/urls/${url.id}`;
      anchorEle.setAttribute('target', '_blank');
      anchorEle.classList.add(
        'text-left',
        'text-sm',
        'lg:text-md',
        'break-all'
      );

      // add short url paragraph
      divEle.appendChild(shortParaEle);
      divEle.appendChild(anchorEle);

      // long url details
      longAnchorEle.title = `${window.location.origin}/${url.id}`;
      longAnchorEle.href = `${window.location.origin}/api/v1/urls/${url.id}`;
      longAnchorEle.setAttribute('target', '_blank');
      longAnchorEle.classList.add(
        'text-left',
        'text-sm',
        'lg:text-md',
        'break-all'
      );

      longAnchorEle.appendChild(longLink);
      divEle.appendChild(longParaEle);
      divEle.appendChild(longAnchorEle);

      divEle.classList.add('lg:mr-10');
      divOuterEle.classList.add(
        'flex',
        'flex-col',
        'lg:flex-row',
        'lg:items-center',
        'justify-center',
        'mb-2',
        'card',
        'w-full'
      );
      deleteDivEle.innerText = 'Delete';
      copyDivEle.innerText = 'Copy';
      deleteDivEle.classList.add(
        'bg-red-500',
        'text-white',
        'border',
        'rounded',
        'w-20',
        'cursor-pointer',
        'mt-2',
        'lg:mt-0',
        'block'
      );
      copyDivEle.classList.add(
        'bg-blue-500',
        'text-white',
        'border',
        'rounded',
        'w-20',
        'cursor-pointer',
        'mt-2',
        'lg:mt-0'
      );
      deleteDivEle.setAttribute('id', `${url.id}`);
      deleteDivEle.onclick = function () {
        deleteURL(`${url.id}`);
      };
      copyDivEle.setAttribute('id', `${url.id}`);
      copyDivEle.onclick = function () {
        navigator.clipboard
          .writeText(`${window.location.origin}/api/v1/urls/${url.id}`)
          .catch(() => {
            console.error('Async: Could not copy text: ');
          });
      };

      divOuterEle.appendChild(divEle);
      buttonWrapDivEle.classList.add(
        'flex',
        'lg:flex-col',
        'justify-center',
        'items-center'
      );
      if (!isFetchRequired) {
        buttonWrapDivEle.appendChild(copyDivEle);
        buttonWrapDivEle.appendChild(deleteDivEle);
        // divOuterEle.appendChild(deleteDivEle);
        // divOuterEle.appendChild(copyDivEle);
        divOuterEle.appendChild(buttonWrapDivEle);
      }

      if (isNewlyCreated) urlListElement.appendChild(divOuterEle);

      if (i === 0 && (urlsDataList.length > 1 || !isNewlyCreated)) {
        appendPreviousElement(previousDivEle);
      }

      // if(i === 0 &&)

      if (!isNewlyCreated) urlListElement.appendChild(divOuterEle);

      urlListElement.classList.add(
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      );
    });
  }
  isURLsAvailable(urlsDataList.length);
};

const deleteChildNodes = () => {
  let child = urlListElement.lastElementChild;
  while (child) {
    urlListElement.removeChild(child);
    child = urlListElement.lastElementChild;
  }
};

const isURLsAvailable = (urlList) => {
  if (urlList && isNewlyCreated && !isCurrentUrlDeleted) {
    currentURLElement.innerText = 'Current Shorten URL';
  } else {
    currentURLElement.innerText = '';
  }
};

const appendPreviousElement = (previousDivEle) => {
  urlListElement.appendChild(previousDivEle);
  previousDivEle.classList.add('text-gray-600', 'my-2');
  previousDivEle.innerText = 'Previous URL Shorteners';
};
