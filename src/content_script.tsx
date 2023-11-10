interface Empresa {
  id: string;
  nomeFantasia?: string;
  razaoSocial: string;
}

function findElementByText(elementType: string, text: string): Node[] {
  const xpath = `//${elementType}[text()='${text}']`;
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  const matchingElements = [];

  for (let i = 0; i < result.snapshotLength; i++) {
    const item = result.snapshotItem(i);
    if (item) {
      matchingElements.push(item);
    }
  }

  return matchingElements;
}

function injectButtons(empresas: Empresa[]) {
  const addedMap = new Map<string, number>();
  const iconUrl = chrome.runtime.getURL("newtab.svg");

  for (const empresa of empresas) {
    const elemId = `enhancer-${empresa.id}`;
    const existingButton = document.getElementById(elemId);

    if (existingButton) {
      continue;
    }

    const fieldTextId = empresa.nomeFantasia || empresa.razaoSocial;

    const matchingElement = findElementByText(
      "p",
      empresa.nomeFantasia || empresa.razaoSocial
    );
    if (!matchingElement || matchingElement.length === 0) {
      continue;
    }

    let nameIdx = 0;
    if (addedMap.has(fieldTextId)) {
      nameIdx = addedMap.get(fieldTextId)!;
      nameIdx++;
    }
    addedMap.set(fieldTextId, nameIdx);

    if (matchingElement.length < nameIdx + 1) {
      continue;
    }

    const parentOfParentOfParentOfParentOf =
      matchingElement[nameIdx].parentElement?.parentElement?.parentElement
        ?.parentElement;
    if (!parentOfParentOfParentOfParentOf) {
      continue;
    }

    const currLocation = window.location;

    const footer =
      parentOfParentOfParentOfParentOf.getElementsByTagName("footer")[0];
    const classes = footer.getElementsByTagName("button")[0].className;

    const toInject = document.createElement("a");
    toInject.href = `${currLocation.pathname}/${empresa.id}/encontros${currLocation.search}`;
    toInject.target = "_blank";
    toInject.id = elemId;

    const icon = document.createElement("img");
    icon.src = iconUrl;
    icon.width = 24;
    icon.className = classes;
    toInject.appendChild(icon);

    footer.appendChild(toInject);
  }
}

window.addEventListener("FoundEmpresas", (evt) => {
  // @ts-ignore
  const empresas = evt.detail as Empresa[];

  if (!empresas || empresas.length === 0) {
    return;
  }

  setTimeout(() => {
    injectButtons(empresas);
  }, 1000);
});
