function traverseObj(obj: Object) {
  const seen = new Map();
  const empresas: any[] = [];

  const recurse = (obj: any) => {
    if (!obj) {
      return;
    }
    seen.set(obj, true);

    if (obj.razaoSocial) {
      empresas.push(obj);
    }

    Object.entries(obj).forEach(([k, v]) => {
      if (typeof v !== "object") return;
      if (!seen.has(v)) {
        try {
          recurse(v);
        } catch (e) {
          //
        }
      }
    });
  };

  recurse(obj);
  return empresas;
}

try {
  const root = document.getElementById("root");
  if (root) {
    const empresasResult = traverseObj(root);
    const event = new CustomEvent("FoundEmpresas", { detail: empresasResult });
    window.dispatchEvent(event);
  }
} catch (e) {
  console.error("yeet", e);
  // nomnom
}
