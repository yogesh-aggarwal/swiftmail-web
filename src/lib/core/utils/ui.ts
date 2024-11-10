export function classNames(...args: (string | Record<string, any>)[]) {
   return args
      .filter((x) => x)
      .map((x) =>
         typeof x === "string"
            ? x
            : Object.keys(x)
                 .filter((key) => x[key])
                 .join(" ")
      )
      .join(" ")
}
