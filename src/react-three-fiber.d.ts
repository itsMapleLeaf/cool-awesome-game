// here until types are fixed
// https://github.com/react-spring/react-three-fiber/issues/239
declare module "react-three-fiber"

declare namespace JSX {
  interface IntrinsicElements {
    [element: string]: any
  }
}
